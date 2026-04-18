package com.example.Worksphere.repo;
import com.example.Worksphere.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<UserModel, Long> {

    Optional<UserModel> findByUsername(String username);

    List<UserModel> findAll();

    Optional<UserModel> findByEmail(String email);

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    @Query("SELECT u FROM UserModel u WHERE u.username = :username")
    Optional<UserModel> getUserByUsernameCustom(@Param("username") String username);

    @Query(value = "SELECT * FROM users WHERE username = :username", nativeQuery = true)
    Optional<UserModel> getUserByUsernameNative(@Param("username") String username);

    @Query("SELECT u.name FROM UserModel u WHERE u.id = :id")
    String getUserNameById(@Param("id") Long id);
}