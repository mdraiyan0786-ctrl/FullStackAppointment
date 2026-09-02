package com.appointment.security;

import com.appointment.entity.Doctor;
import com.appointment.entity.User;
import com.appointment.repository.DoctorRepository;
import com.appointment.repository.UserRepository;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService
        implements UserDetailsService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public CustomUserDetailsService(
            UserRepository userRepository,
            DoctorRepository doctorRepository) {

        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
    }

    // =========================
    // NORMAL USER / DEFAULT
    // =========================

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        User user =
                userRepository.findByEmail(email)
                        .orElse(null);

        if (user != null) {

            String role = user.getRole();

            if (role == null || role.isBlank()) {

                role = "ROLE_USER";

            } else if (!role.startsWith("ROLE_")) {

                role = "ROLE_" + role;
            }

            return org.springframework.security.core.userdetails.User
                    .withUsername(user.getEmail())
                    .password(user.getPassword())
                    .authorities(role)
                    .build();
        }

        Doctor doctor =
                doctorRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "User or Doctor not found: "
                                                + email
                                )
                        );

        return org.springframework.security.core.userdetails.User
                .withUsername(doctor.getEmail())
                .password(doctor.getPassword())
                .authorities("ROLE_DOCTOR")
                .build();
    }

    // =========================
    // LOAD USER BY EMAIL + ROLE
    // =========================

    public UserDetails loadUserByUsernameAndRole(
            String email,
            String role) {

        // =========================
        // DOCTOR
        // =========================

        if ("DOCTOR".equalsIgnoreCase(role)) {

            Doctor doctor =
                    doctorRepository.findByEmail(email)
                            .orElseThrow(() ->
                                    new UsernameNotFoundException(
                                            "Doctor not found: "
                                                    + email
                                    )
                            );

            return org.springframework.security.core.userdetails.User
                    .withUsername(doctor.getEmail())
                    .password(doctor.getPassword())
                    .authorities("ROLE_DOCTOR")
                    .build();
        }

        // =========================
        // NORMAL USER
        // =========================

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "User not found: "
                                                + email
                                )
                        );

        String userRole = user.getRole();

        if (userRole == null ||
                userRole.isBlank()) {

            userRole = "ROLE_USER";

        } else if (!userRole.startsWith("ROLE_")) {

            userRole = "ROLE_" + userRole;
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(userRole)
                .build();
    }
}