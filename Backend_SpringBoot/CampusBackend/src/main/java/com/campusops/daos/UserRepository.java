package com.campusops.daos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.campusops.entities.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    List<User> findByCourseIdAndRole(Integer courseId, String role);

    User findByUserid(Integer userid);
    Optional<User> findByEmail(String email);

}
