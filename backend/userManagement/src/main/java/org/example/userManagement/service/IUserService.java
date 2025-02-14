package org.example.userManagement.service;

import org.example.userManagement.model.User;

import java.util.List;

public interface IUserService {
    User registerUser(User user);
    List<User> getUsers();
    void deleteUser(String email);
    void deleteUserById(Long userId);
    User getUserById(Long userId);
    User getUser(String email);
    User updateUser(Long userId, User userDetails);
}
