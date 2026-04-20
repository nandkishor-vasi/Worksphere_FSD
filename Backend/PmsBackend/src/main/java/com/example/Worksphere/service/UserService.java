package com.example.Worksphere.service;

import com.example.Worksphere.model.AdminModel;
import com.example.Worksphere.model.MemberModel;
import com.example.Worksphere.model.Role;
import com.example.Worksphere.model.UserModel;
import com.example.Worksphere.repo.AdminRepo;
import com.example.Worksphere.repo.MemberRepo;
import com.example.Worksphere.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class UserService {

    @Autowired
    private UserRepo repo;

    @Autowired
    private AdminRepo adminRepo;

    @Autowired
    private MemberRepo memberRepo;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Transactional
    public UserModel saveUser(UserModel user) {

        user.setPassword(encoder.encode(user.getPassword()));

        UserModel savedUser = repo.save(user);

        if (user.getRole() == Role.MEMBER) {
            MemberModel member = new MemberModel();
            member.setUser(savedUser);
            savedUser.setMember(member);
            user.setMember(member);
        } else if (user.getRole() == Role.ADMIN) {
            AdminModel admin = new AdminModel();
            admin.setUser(savedUser);
            savedUser.setAdmin(admin);
            user.setAdmin(admin);
        }

        return repo.save(savedUser);
    }

    public UserModel getUserByUsername(String username) {
        return repo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

}
