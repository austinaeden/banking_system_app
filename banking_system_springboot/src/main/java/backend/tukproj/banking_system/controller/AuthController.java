package backend.tukproj.banking_system.controller;

import backend.tukproj.banking_system.model.User;
import backend.tukproj.banking_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller for handling authentication-related requests (Login and Registration).
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * Authenticates a user based on email and password.
     * @param credentials Map containing "email" and "password"
     * @return ResponseEntity with success status and user data or error message
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userService.authenticate(email, password);
        if (user != null) {
            // Return user object on successful login
            return ResponseEntity.ok(Map.of("success", true, "user", user));
        } else {
            // Return error message on failure
            return ResponseEntity.ok(Map.of("success", false, "message", "Invalid credentials"));
        }
    }

    /**
     * Registers a new user in the system.
     * @param userData Map containing "username", "email", and "password"
     * @return ResponseEntity with registration status
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> userData) {
        try {
            String username = userData.get("username");
            String email = userData.get("email");
            String password = userData.get("password");

            // Delegate registration logic to UserService
            User user = userService.register(username, email, password);
            return ResponseEntity.ok(Map.of("success", true, "user", user));
        } catch (Exception e) {
            // Return error if registration fails (e.g., email already exists)
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
