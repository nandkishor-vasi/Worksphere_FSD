package com.example.Worksphere.repo;
import com.example.Worksphere.model.ProjectModel;
import com.example.Worksphere.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface ProjectRepo extends JpaRepository<ProjectModel, Long> {

    @Query("""
    SELECT p FROM ProjectModel p
    LEFT JOIN FETCH p.createdBy
    LEFT JOIN FETCH p.members
    WHERE p.createdBy.id = :userId
""")
    List<ProjectModel> findByCreatedById(@Param("userId") Long userId);

    @Query("""
    SELECT DISTINCT p FROM ProjectModel p
    JOIN p.members m
    LEFT JOIN FETCH p.createdBy
    LEFT JOIN FETCH p.members
    WHERE m.id = :userId
""")
    List<ProjectModel> findByMemberId(@Param("userId") Long userId);

    @Query("SELECT p.members FROM ProjectModel p WHERE p.id = :projectId")
    Set<UserModel> getMembersForProject(@Param("projectId") Long projectId);

    @Query("SELECT p.createdBy FROM ProjectModel p WHERE p.id = :projectId")
    UserModel getAdminForProject(@Param("projectId") Long projectId);

}