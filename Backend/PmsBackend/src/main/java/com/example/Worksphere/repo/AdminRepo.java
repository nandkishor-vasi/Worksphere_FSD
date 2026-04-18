package com.example.Worksphere.repo;
import com.example.Worksphere.model.AdminModel;
import com.example.Worksphere.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface AdminRepo extends JpaRepository<AdminModel, Long> {

    Optional<AdminModel> findByUserId(Long userId);

    @Query("SELECT a FROM AdminModel a WHERE a.user.id = :userId")
    Optional<AdminModel> getByUserId(@Param("userId") Long userId);

    @Query("""
        SELECT u FROM UserModel u
        WHERE u.role = 'MEMBER'
    """)
    Set<UserModel> findAllMembers();
}