package backend.tukproj.banking_system.service;

import backend.tukproj.banking_system.model.Account;
import backend.tukproj.banking_system.model.User;
import backend.tukproj.banking_system.repository.AccountRepository;
import backend.tukproj.banking_system.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class DatabaseSeederService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AccountRepository accountRepository;

    @PostConstruct
    public void seedDatabase() {
        // Seed Admin User
        Optional<User> adminOpt = userRepository.findByEmail("admin@gmail.com");
        if (adminOpt.isEmpty()) {
            User admin = new User();
            admin.setUsername("System Admin");
            admin.setEmail("admin@gmail.com");
            admin.setPasswordHash("password123");
            admin.setPhoneNumber("+1 000 000 000");
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }

        // Seed Normal User
        Optional<User> userOpt = userRepository.findByEmail("austinaeden@gmail.com");
        if (userOpt.isEmpty()) {
            User user = new User();
            user.setUsername("Austin Aeden");
            user.setEmail("austinaeden@gmail.com");
            user.setPasswordHash("password123");
            user.setPhoneNumber("+1 234 567 890");
            user.setRole("USER");
            user = userRepository.save(user);

            // Create some default accounts for this user so the frontend works
            Account checking = new Account();
            checking.setUser(user);
            checking.setAccountName("Checking");
            checking.setAccountNumber("**** 4421");
            checking.setAccountType("Personal");
            checking.setBalance(new BigDecimal("12450.50"));
            accountRepository.save(checking);

            Account savings = new Account();
            savings.setUser(user);
            savings.setAccountName("Savings");
            savings.setAccountNumber("**** 8892");
            savings.setAccountType("Personal");
            savings.setBalance(new BigDecimal("45200.00"));
            accountRepository.save(savings);
        }
    }
}
