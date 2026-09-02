package com.appointment.service;

import com.appointment.entity.Doctor;
import com.appointment.entity.PasswordResetOtp;
import com.appointment.entity.User;
import com.appointment.repository.DoctorRepository;
import com.appointment.repository.PasswordResetOtpRepository;
import com.appointment.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
public class PasswordResetOtpService {

    private final PasswordResetOtpRepository otpRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private final SecureRandom secureRandom = new SecureRandom();

    public PasswordResetOtpService(
            PasswordResetOtpRepository otpRepository,
            UserRepository userRepository,
            DoctorRepository doctorRepository,
            EmailService emailService,
            PasswordEncoder passwordEncoder
    ) {
        this.otpRepository = otpRepository;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public void requestOtp(String email) {

        String accountType = findAccountType(email);

        // Remove previous OTPs for this account
        otpRepository.deleteByEmailAndAccountType(
                email,
                accountType
        );

        // Generate a 6-digit OTP
        String otp = String.format(
                "%06d",
                secureRandom.nextInt(1_000_000)
        );

        PasswordResetOtp passwordResetOtp =
                new PasswordResetOtp();

        passwordResetOtp.setEmail(email);
        passwordResetOtp.setAccountType(accountType);
        passwordResetOtp.setOtp(otp);
        passwordResetOtp.setExpiresAt(
                LocalDateTime.now().plusMinutes(10)
        );
        passwordResetOtp.setUsed(false);
        passwordResetOtp.setVerified(false);

        otpRepository.save(passwordResetOtp);

        emailService.sendOtpEmail(email, otp);
    }

    public String verifyOtp(
            String email,
            String otp) {

        String accountType = findAccountType(email);

        PasswordResetOtp passwordResetOtp =
                otpRepository
                        .findTopByEmailAndAccountTypeAndUsedFalseOrderByIdDesc(
                                email,
                                accountType
                        )
                        .orElseThrow(() ->
                                new RuntimeException("OTP not found")
                        );

        if (passwordResetOtp.getExpiresAt()
                .isBefore(LocalDateTime.now())) {

            throw new RuntimeException("OTP has expired");
        }

        if (!passwordResetOtp.getOtp().equals(otp)) {

            throw new RuntimeException("Invalid OTP");
        }

        // Generate secure temporary reset token
        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);

        String resetToken =
                Base64.getUrlEncoder()
                        .withoutPadding()
                        .encodeToString(tokenBytes);

        passwordResetOtp.setVerified(true);
        passwordResetOtp.setResetToken(resetToken);
        passwordResetOtp.setResetTokenExpiresAt(
                LocalDateTime.now().plusMinutes(10)
        );

        otpRepository.save(passwordResetOtp);

        return resetToken;
    }

    public void resetPassword(
            String resetToken,
            String newPassword) {

        PasswordResetOtp passwordResetOtp =
                otpRepository.findByResetToken(resetToken)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid reset token"
                                )
                        );

        // OTP must have been successfully verified
        if (!passwordResetOtp.isVerified()) {
            throw new RuntimeException(
                    "OTP has not been verified"
            );
        }

        // Reset token must still be valid
        if (passwordResetOtp.getResetTokenExpiresAt()
                == null ||
                passwordResetOtp.getResetTokenExpiresAt()
                        .isBefore(LocalDateTime.now())) {

            throw new RuntimeException(
                    "Reset token has expired"
            );
        }

        // Prevent reuse
        if (passwordResetOtp.isUsed()) {
            throw new RuntimeException(
                    "Reset token has already been used"
            );
        }

        String email = passwordResetOtp.getEmail();
        String accountType = passwordResetOtp.getAccountType();

        String encodedPassword =
                passwordEncoder.encode(newPassword);

        if ("USER".equals(accountType)) {

            User user =
                    userRepository.findByEmail(email)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );

            user.setPassword(encodedPassword);

            userRepository.save(user);

        } else if ("DOCTOR".equals(accountType)) {

            Doctor doctor =
                    doctorRepository.findByEmail(email)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Doctor not found"
                                    )
                            );

            doctor.setPassword(encodedPassword);

            doctorRepository.save(doctor);

        } else {

            throw new RuntimeException(
                    "Invalid account type"
            );
        }

        // Invalidate the OTP/reset token
        passwordResetOtp.setUsed(true);
        passwordResetOtp.setVerified(false);
        passwordResetOtp.setResetToken(null);
        passwordResetOtp.setResetTokenExpiresAt(null);

        otpRepository.save(passwordResetOtp);
    }

    private String findAccountType(String email) {

        if (userRepository.existsByEmail(email)) {
            return "USER";
        }

        if (doctorRepository.existsByEmail(email)) {
            return "DOCTOR";
        }

        throw new RuntimeException(
                "No account found with this email"
        );
    }
}