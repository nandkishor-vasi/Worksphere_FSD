package com.example.Worksphere.controller;

import com.example.Worksphere.model.UserModel;
import com.example.Worksphere.service.JwtService;
import com.example.Worksphere.service.UserService;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.MockitoAnnotations.openMocks;

public class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private UserController userController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setup() {
        openMocks(this);
    }

    @Test
    void testSignup() {
        UserModel user = new UserModel();
        user.setUsername("testuser");

        Mockito.when(userService.saveUser(Mockito.any()))
                .thenReturn(user);

        UserModel result = userController.signup(user);

        assertEquals("testuser", result.getUsername());
    }

    @Test
    void testLogin() {
        UserModel user = new UserModel();
        user.setUsername("testuser");
        user.setPassword("1234");

        Authentication auth = Mockito.mock(Authentication.class);

        Mockito.when(authenticationManager.authenticate(Mockito.any()))
                .thenReturn(auth);
        Mockito.when(auth.isAuthenticated()).thenReturn(true);

        Mockito.when(jwtService.generateToken("testuser"))
                .thenReturn("token");

        Mockito.when(userService.getUserByUsername("testuser"))
                .thenReturn(user);

        Map<String, Object> response = userController.login(user);

        assertEquals("testuser", response.get("username"));
        assertEquals("token", response.get("token"));
    }
}