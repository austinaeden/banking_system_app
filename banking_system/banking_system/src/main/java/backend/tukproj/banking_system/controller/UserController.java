package backend.tukproj.banking_system.controller;

import backend.tukproj.banking_system.model.Account;
import backend.tukproj.banking_system.model.Notification;
import backend.tukproj.banking_system.model.Transaction;
import backend.tukproj.banking_system.model.User;
import backend.tukproj.banking_system.service.AccountService;
import backend.tukproj.banking_system.service.NotificationService;
import backend.tukproj.banking_system.service.TransactionService;
import backend.tukproj.banking_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/{id}/data")
    public ResponseEntity<?> getUserData(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
        }

        List<Account> accounts = accountService.getAccountsByUserId(id);
        List<Transaction> transactions = transactionService.getTransactionsByUserId(id);
        List<Notification> notifications = notificationService.getNotificationsForUser(id);

        return ResponseEntity.ok(Map.of(
                "accounts", accounts,
                "transactions", transactions,
                "notifications", notifications,
                "user", user
        ));
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User profileData) {
        User updatedUser = userService.updateProfile(id, profileData);
        if (updatedUser != null) {
            return ResponseEntity.ok(Map.of("success", true, "user", updatedUser));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
        }
    }
}
