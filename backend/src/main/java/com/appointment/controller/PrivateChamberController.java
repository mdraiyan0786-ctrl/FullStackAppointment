package com.appointment.controller;

import com.appointment.entity.PrivateChamber;
import com.appointment.service.PrivateChamberService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/private-chambers")
@CrossOrigin(origins = "http://localhost:5173")
public class PrivateChamberController {

    private PrivateChamberService privateChamberService;

    public PrivateChamberController(
            PrivateChamberService privateChamberService) {

        this.privateChamberService = privateChamberService;
    }
    @PostMapping
    public ResponseEntity<?> createChamber(@RequestBody Map<String,String> request,
                                           Authentication authentication){
        try{
            PrivateChamber chamber = privateChamberService.createChamber(
                    authentication.getName(),
                    request.get("name"),
                    request.get("address"),
                    request.get("phone")
            );
            return ResponseEntity.ok(chamber);
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().body(
                    Map.of("message",e.getMessage())
            );
        }
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyChambers(
            Authentication authentication) {

        try {
            List<PrivateChamber> chambers =
                    privateChamberService.getMyChambers(
                            authentication.getName()
                    );
            return ResponseEntity.ok(chambers);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getChamber(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            PrivateChamber chamber =
                    privateChamberService.getChamber(
                            id,
                            authentication.getName()
                    );
            return ResponseEntity.ok(chamber);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateChamber(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        try {
            PrivateChamber chamber =
                    privateChamberService.updateChamber(
                            id,
                            authentication.getName(),
                            request.get("name"),
                            request.get("address"),
                            request.get("phone")
                    );
            return ResponseEntity.ok(chamber);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteChamber(
            @PathVariable Long id,
            Authentication authentication) {
        try {
            privateChamberService.deleteChamber(
                    id,
                    authentication.getName()
            );
            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Private chamber deleted successfully"
                    )
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }


}
