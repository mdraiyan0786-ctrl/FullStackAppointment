package com.appointment.controller;

import com.appointment.entity.DoctorReview;
import com.appointment.service.DoctorReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorReviewController {

    private final DoctorReviewService reviewService;

    public DoctorReviewController(
            DoctorReviewService reviewService) {

        this.reviewService = reviewService;
    }

    // ==========================================
    // CREATE REVIEW
    // ==========================================

    @PostMapping("/appointment/{appointmentId}")
    public ResponseEntity<?> createReview(
            @PathVariable Long appointmentId,
            @RequestBody Map<String, Object> request,
            Authentication authentication) {

        try {

            Integer rating =
                    request.get("rating") != null
                            ? ((Number) request.get("rating")).intValue()
                            : null;

            String comment =
                    (String) request.get("comment");

            String patientEmail =
                    authentication.getName();

            DoctorReview review =
                    reviewService.createReview(
                            appointmentId,
                            rating,
                            comment,
                            patientEmail
                    );

            // Never expose password
            if (review.getUser() != null) {
                review.getUser().setPassword(null);
            }

            if (review.getDoctor() != null) {
                review.getDoctor().setPassword(null);
            }

            return ResponseEntity.ok(review);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }

    // ==========================================
    // GET DOCTOR REVIEWS
    // ==========================================

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorReviews(
            @PathVariable Long doctorId) {

        try {

            List<DoctorReview> reviews =
                    reviewService.getDoctorReviews(
                            doctorId
                    );

            // Never expose passwords
            for (DoctorReview review : reviews) {

                if (review.getUser() != null) {
                    review.getUser().setPassword(null);
                }

                if (review.getDoctor() != null) {
                    review.getDoctor().setPassword(null);
                }
            }

            double averageRating =
                    reviewService.getDoctorAverageRating(
                            doctorId
                    );

            long reviewCount =
                    reviewService.getDoctorReviewCount(
                            doctorId
                    );

            Map<String, Object> response =
                    new HashMap<>();

            response.put("averageRating", averageRating);
            response.put("reviewCount", reviewCount);
            response.put("reviews", reviews);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }
    @GetMapping("/my")
    public ResponseEntity<?> getMyReviews(
            Authentication authentication) {

        try {

            String doctorEmail =
                    authentication.getName();

            List<DoctorReview> reviews =
                    reviewService.getMyReviews(
                            doctorEmail
                    );

            for (DoctorReview review : reviews) {

                if (review.getUser() != null) {
                    review.getUser().setPassword(null);
                }

                if (review.getDoctor() != null) {
                    review.getDoctor().setPassword(null);
                }
            }

            double averageRating =
                    reviewService.getMyAverageRating(
                            doctorEmail
                    );

            long reviewCount =
                    reviewService.getMyReviewCount(
                            doctorEmail
                    );

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "averageRating",
                    averageRating
            );

            response.put(
                    "reviewCount",
                    reviewCount
            );

            response.put(
                    "reviews",
                    reviews
            );

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }
}