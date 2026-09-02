package com.appointment.repository;



import com.appointment.entity.PasswordResetOtp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {

    Optional<PasswordResetOtp> findTopByEmailAndAccountTypeAndUsedFalseOrderByIdDesc(
            String email,
            String accountType
    );

    void deleteByEmailAndAccountType(String email, String accountType);

    Optional<PasswordResetOtp> findByResetToken(String resetToken);
}