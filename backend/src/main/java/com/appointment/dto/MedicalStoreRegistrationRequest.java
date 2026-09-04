package com.appointment.dto;

public record MedicalStoreRegistrationRequest(
        String adminName,
        String email,
        String password,
        String phone,
        String storeName,
        String address,
        String storePhone,
        String description,
        String openingTime,
        String closingTime
) {
}
