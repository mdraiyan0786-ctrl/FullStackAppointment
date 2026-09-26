package com.appointment.service;

import com.appointment.entity.Doctor;
import com.appointment.entity.PrivateChamber;
import com.appointment.repository.DoctorRepository;
import com.appointment.repository.PrivateChamberRepository;
import org.springframework.stereotype.Service;

import javax.print.Doc;
import java.util.List;

@Service
public class PrivateChamberService {
    private DoctorRepository doctorRepository;
    private PrivateChamberRepository privateChamberRepository;

    public PrivateChamberService(DoctorRepository doctorRepository, PrivateChamberRepository privateChamberRepository) {
        this.doctorRepository = doctorRepository;
        this.privateChamberRepository = privateChamberRepository;
    }

    public PrivateChamber createChamber(
            String doctorEmail,
            String name,
            String address,
            String phone
    ){
        Doctor doctor =doctorRepository.findByEmail(doctorEmail)
                .orElseThrow(()->new RuntimeException("Doctor Not Found"));

        if(name==null||name.trim().isEmpty()){
            throw new RuntimeException("Chamber name is required");
        }

        if(address==null||address.trim().isEmpty()){
            throw new RuntimeException("Address is required");
        }

        if(phone==null||phone.trim().isEmpty()){
            throw new RuntimeException("Phone number is required");
        }

        PrivateChamber privateChamber = new PrivateChamber();

        privateChamber.setName(name.trim());
        privateChamber.setAddress(address.trim());
        privateChamber.setPhone(phone.trim());
        privateChamber.setDoctor(doctor);

        return privateChamberRepository.save(privateChamber);
    }
    public List<PrivateChamber> getMyChambers(String doctorEmail){
        Doctor doctor = doctorRepository.findByEmail(doctorEmail)
                .orElseThrow(()->new RuntimeException("Doctor Not Found"));

        return privateChamberRepository.findByDoctorId(doctor.getId());
    }
    public PrivateChamber getChamber(
            Long chamberId,
            String doctorEmail) {

        Doctor doctor = doctorRepository.findByEmail(doctorEmail)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        return privateChamberRepository
                .findByIdAndDoctorId(
                        chamberId,
                        doctor.getId()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "Private chamber not found"));
    }

    public PrivateChamber updateChamber(
            Long chamberId,
            String doctorEmail,
            String name,
            String address,
            String phone) {

        PrivateChamber chamber =
                getChamber(chamberId, doctorEmail);

        if (name == null || name.trim().isEmpty()) {
            throw new RuntimeException("Chamber name is required");
        }

        if (address == null || address.trim().isEmpty()) {
            throw new RuntimeException("Chamber address is required");
        }

        if (phone == null || phone.trim().isEmpty()) {
            throw new RuntimeException("Chamber phone is required");
        }

        chamber.setName(name.trim());
        chamber.setAddress(address.trim());
        chamber.setPhone(phone.trim());

        return privateChamberRepository.save(chamber);
    }
    public void deleteChamber(
            Long chamberId,
            String doctorEmail) {

        PrivateChamber chamber =
                getChamber(chamberId, doctorEmail);

        privateChamberRepository.delete(chamber);
    }

}
