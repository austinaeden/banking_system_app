package backend.tukproj.banking_system.controller;

import backend.tukproj.banking_system.service.AccountService;
import backend.tukproj.banking_system.service.NotificationService;
import backend.tukproj.banking_system.service.TransactionService;
import backend.tukproj.banking_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/data")
    public ResponseEntity<?> getAdminData() {
        var allUsers = userService.getAllUsers();
        var allAccounts = accountService.getAllAccounts();
        var allTransactions = transactionService.getAllTransactions();
        var totalLiquidity = accountService.getTotalLiquidity();

        return ResponseEntity.ok(Map.of(
                "allUsers", allUsers,
                "allAccounts", allAccounts,
                "allTransactions", allTransactions,
                "stats", Map.of(
                        "totalLiquidity", totalLiquidity,
                        "activeUsers", allUsers.size(),
                        "totalTransactions", allTransactions.size(),
                        "systemHealth", "Optimal"
                )
        ));
    }

    @PostMapping("/notify")
    public ResponseEntity<?> sendNotification(@RequestBody Map<String, String> notificationData) {
        String title = notificationData.get("name");
        String message = notificationData.get("message");
        
        notificationService.sendNotificationToAll(title, message);
        return ResponseEntity.ok(Map.of("success", true));
    }
}
