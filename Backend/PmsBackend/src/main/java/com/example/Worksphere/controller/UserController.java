package com.example.Worksphere.controller;

import com.example.Worksphere.model.UserModel;
//import com.example.CepDemo1.service.AuthService;
import com.example.Worksphere.service.JwtService;
import com.example.Worksphere.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public UserController(UserService userService,
                          AuthenticationManager authenticationManager,
                          JwtService jwtService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public UserModel signup(@RequestBody UserModel user) {
        return userService.saveUser(user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody UserModel user) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));

        if(authentication.isAuthenticated()){
            String token = jwtService.generateToken(user.getUsername());
            UserModel loggedInUser = userService.getUserByUsername(user.getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("username", loggedInUser.getUsername());
            response.put("role", loggedInUser.getRole());
            response.put("token", token);
            response.put("id", loggedInUser.getId());
            response.put("email", loggedInUser.getEmail());

            return  response;

        } else {
            throw new RuntimeException("Authentication Failed");
        }
    }
    

}