package com.example.Worksphere.controller;

import com.example.Worksphere.dto.AdminDTO;
import com.example.Worksphere.dto.UserDTO;
import com.example.Worksphere.service.AdminService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.MockitoAnnotations.openMocks;

public class AdminControllerTest {

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    @BeforeEach
    void setup() {
        openMocks(this);
    }

    @Test
    void testGetById() {
        AdminDTO admin = new AdminDTO();
        admin.setId(1L);

        when(adminService.getAdminById(1L)).thenReturn(admin);

        var response = adminController.getById(1L);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1L, response.getBody().getId());
    }

    @Test
    void testGetMembers() {
        Set<UserDTO> members = new HashSet<>();

        when(adminService.getMembers()).thenReturn(members);

        var response = adminController.getMembers();

        assertEquals(200, response.getStatusCodeValue());
        assertNotNull(response.getBody());
    }
}