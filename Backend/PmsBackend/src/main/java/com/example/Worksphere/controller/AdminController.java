package com.example.Worksphere.controller;

import com.example.Worksphere.dto.AdminDTO;
import com.example.Worksphere.dto.UserDTO;
import com.example.Worksphere.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/{adminId}")
    public ResponseEntity<AdminDTO> getById(@PathVariable Long adminId){
        return ResponseEntity.ok(adminService.getAdminById(adminId));
    }

    @GetMapping("/members")
    public ResponseEntity<Set<UserDTO>> getMembers(){
        return ResponseEntity.ok(adminService.getMembers());
    }
}
