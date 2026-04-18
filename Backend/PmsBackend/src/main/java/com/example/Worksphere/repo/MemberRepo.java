package com.example.Worksphere.repo;

import com.example.Worksphere.model.MemberModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepo extends JpaRepository<MemberModel, Long> {

    Optional<MemberModel> findByUserId(Long userId);

    @Query("SELECT m FROM MemberModel m WHERE m.user.id = :userId")
    Optional<MemberModel> getByUserId(@Param("userId") Long userId);
}