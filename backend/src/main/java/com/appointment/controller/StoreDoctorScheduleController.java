
package com.appointment.controller;

import com.appointment.entity.StoreDoctorSchedule;
import com.appointment.service.StoreDoctorScheduleService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/store-doctor-schedules")
@CrossOrigin(origins = "http://localhost:5173")
@PreAuthorize("hasRole('STORE_ADMIN')")
public class StoreDoctorScheduleController {

    private final StoreDoctorScheduleService scheduleService;

    public StoreDoctorScheduleController(
            StoreDoctorScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    // Get all schedules for a store
    @GetMapping("/store/{storeId}")
    public ResponseEntity<?> getStoreSchedules(
            @PathVariable Long storeId,
            Authentication authentication) {
        try {
            List<StoreDoctorSchedule> schedules =
                    scheduleService.getStoreSchedules(
                            storeId, authentication.getName());

            return ResponseEntity.ok(schedules);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // Get schedules for one doctor at a store
    @GetMapping("/store/{storeId}/doctor/{doctorId}")
    public ResponseEntity<?> getDoctorSchedules(
            @PathVariable Long storeId,
            @PathVariable Long doctorId,
            Authentication authentication) {
        try {
            return ResponseEntity.ok(
                    scheduleService.getDoctorSchedules(
                            storeId, doctorId, authentication.getName()));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // Add a schedule with a maximum patient capacity
    @PostMapping("/store/{storeId}/doctor/{doctorId}")
    public ResponseEntity<?> addSchedule(
            @PathVariable Long storeId,
            @PathVariable Long doctorId,

            @RequestParam DayOfWeek dayOfWeek,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
            LocalTime startTime,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.TIME)
            LocalTime endTime,

            @RequestParam Integer maxPatients,

            Authentication authentication) {
        try {
            StoreDoctorSchedule schedule =
                    scheduleService.addSchedule(
                            storeId,
                            doctorId,
                            dayOfWeek,
                            startTime,
                            endTime,
                            maxPatients,
                            authentication.getName());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(schedule);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // Delete a schedule
    @DeleteMapping("/store/{storeId}/{scheduleId}")
    public ResponseEntity<?> deleteSchedule(
            @PathVariable Long storeId,
            @PathVariable Long scheduleId,
            Authentication authentication) {
        try {
            scheduleService.deleteSchedule(
                    storeId, scheduleId, authentication.getName());

            return ResponseEntity.ok(
                    Map.of("message", "Schedule deleted successfully."));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
