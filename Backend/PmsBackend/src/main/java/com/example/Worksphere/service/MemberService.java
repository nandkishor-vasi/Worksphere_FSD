package com.example.Worksphere.service;

import com.example.Worksphere.dto.MemberDTO;
import com.example.Worksphere.model.MemberModel;
import com.example.Worksphere.repo.MemberRepo;
import com.example.Worksphere.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MemberService {
    @Autowired
    private MemberRepo memberRepo;

    @Autowired
    private UserRepo userRepo;

    public MemberDTO getMemberById(Long id) {

        MemberModel member = memberRepo.findByUserId(id)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        MemberDTO dto = new MemberDTO();

        dto.setId(member.getId());
        dto.setProfilePicture(member.getProfilePicture());
        dto.setAddress(member.getAddress());
        dto.setActive(member.isActive());

        if (member.getUser() != null) {
            dto.setName(member.getUser().getName());
            dto.setEmail(member.getUser().getEmail());
        }

        return dto;
    }
}
