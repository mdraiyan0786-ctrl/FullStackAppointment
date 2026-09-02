package com.appointment.dto;

import com.appointment.entity.Doctor;

public class DoctorResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String specialization;
    private String qualification;
    private String degree;
    private Integer experience;
    private Double consultationFee;
    private String imageUrl;
    private String availableTime;
    private Double rating;
    private Long reviewCount;

    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public DoctorResponse(
            Doctor doctor,
            Double rating,
            Long reviewCount) {

        this.id = doctor.getId();
        this.name = doctor.getName();
        this.email = doctor.getEmail();
        this.phone = doctor.getPhone();
        this.specialization =
                doctor.getSpecialization();
        this.qualification =
                doctor.getQualification();
        this.degree =
                doctor.getDegree();
        this.experience =
                doctor.getExperience();
        this.consultationFee =
                doctor.getConsultationFee();
        this.imageUrl =
                doctor.getImageUrl();
        this.availableTime =
                doctor.getAvailableTime();

        this.rating = rating;
        this.reviewCount = reviewCount;
    }

    // ==========================================
    // GETTERS
    // ==========================================

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getSpecialization() {
        return specialization;
    }

    public String getQualification() {
        return qualification;
    }

    public String getDegree() {
        return degree;
    }

    public Integer getExperience() {
        return experience;
    }

    public Double getConsultationFee() {
        return consultationFee;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getAvailableTime() {
        return availableTime;
    }

    public Double getRating() {
        return rating;
    }

    public Long getReviewCount() {
        return reviewCount;
    }


}
