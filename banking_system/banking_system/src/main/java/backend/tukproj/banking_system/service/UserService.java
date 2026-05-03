package backend.tukproj.banking_system.service;

import backend.tukproj.banking_system.model.User;
import backend.tukproj.banking_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User authenticate(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Basic matching for now
            if (user.getPasswordHash().equals(password)) {
                return user;
            }
        }
        return null;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User updateProfile(Long id, User updatedUser) {
        User user = getUserById(id);
        if (user != null) {
            user.setUsername(updatedUser.getUsername() != null ? updatedUser.getUsername() : user.getUsername());
            user.setPhoneNumber(updatedUser.getPhoneNumber() != null ? updatedUser.getPhoneNumber() : user.getPhoneNumber());
            return userRepository.save(user);
        }
        return null;
    }
}
