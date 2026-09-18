package com.appointment.dto;

public record StoreAdminLoginResponse (
        String token,
        Long userId,
        String name,
        String email,
        String role,
        Long storeId,
        String storeName
){
}
