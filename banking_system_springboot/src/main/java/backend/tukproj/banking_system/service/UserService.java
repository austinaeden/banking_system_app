package backend.tukproj.banking_system.service;

import backend.tukproj.banking_system.model.Account;
import backend.tukproj.banking_system.model.User;
import backend.tukproj.banking_system.repository.AccountRepository;
import backend.tukproj.banking_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

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

    public User register(String username, String email, String password) {
        try {
            if (userRepository.findByEmail(email).isPresent()) {
                throw new RuntimeException("Email already in use");
            }

            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPasswordHash(password);
            user.setRole("USER");
            user = userRepository.save(user);

            // Generate a random 10-digit account number (starting with 10)
            String randomAcc = "10" + (long) (Math.random() * 900_000_00L + 100_000_00L);

            // Create a default Checking account for the new user
            Account checking = new Account();
            checking.setUser(user);
            checking.setAccountName("Main Checking");
            checking.setAccountNumber(randomAcc);
            checking.setAccountType("Personal");
            checking.setBalance(new BigDecimal("1000.00"));
            accountRepository.save(checking);

            return user;
        } catch (Exception e) {
            System.err.println("Registration error: " + e.getMessage());
            throw e;
        }
    }

    public User updateProfilePhoto(Long id, String photoUrl) {
        User user = getUserById(id);
        if (user != null) {
            user.setProfilePhoto(photoUrl);
            return userRepository.save(user);
        }
        return null;
    }
}
