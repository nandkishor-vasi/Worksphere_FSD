package com.example.Worksphere.service;

import com.example.Worksphere.dto.AdminDTO;
import com.example.Worksphere.dto.UserDTO;
import com.example.Worksphere.model.AdminModel;
import com.example.Worksphere.repo.AdminRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminService {
    @Autowired
    private AdminRepo adminRepo;

    public AdminDTO getAdminById(Long userId) {

        AdminModel admin = adminRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        AdminDTO dto = new AdminDTO();

        dto.setId(admin.getId());

        if (admin.getUser() != null) {
            dto.setName(admin.getUser().getName());
            dto.setEmail(admin.getUser().getEmail());
        }

        dto.setCity(admin.getCity());
        dto.setState(admin.getState());
        dto.setCountry(admin.getCountry());
        dto.setDesignation(admin.getDesignation());
        dto.setProfileImageUrl(admin.getProfileImageUrl());

        return dto;
    }

    public Set<UserDTO> getMembers() {

        return adminRepo.findAllMembers()
                .stream()
                .map(user -> {
                    UserDTO dto = new UserDTO();
                    dto.setId(user.getId());
                    dto.setName(user.getName());
                    dto.setEmail(user.getEmail());
                    return dto;
                })
                .collect(Collectors.toSet());
    }
}
