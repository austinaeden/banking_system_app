package backend.tukproj.banking_system.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Represents a system user (either an administrator or a standard customer).
 * This class is mapped to the "users" table in the database.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    @JsonProperty("username")
    private String username;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false)
    @JsonIgnore // Prevent password hash from being sent to the frontend for security
    private String passwordHash;

    @Column(name = "phone_number", length = 20)
    @JsonProperty("phone")
    private String phoneNumber;

    @Column(name = "account_tier", length = 50)
    private String accountTier = "Standard"; // Standard, Premium, Gold, etc.

    @Column(length = 20)
    private String role = "USER"; // USER or ADMIN

    @Column(name = "profile_photo", columnDefinition = "LONGTEXT")
    private String profilePhoto; // Base64 encoded image string

    @Column(name = "registered_at", insertable = true, updatable = true)
    @com.fasterxml.jackson.annotation.JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime registeredAt;

    /**
     * Relationship with Account entity. A user can have multiple accounts (Checking, Savings, etc.).
     */
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<Account> accounts;

    /**
     * Lifecycle callback to set registration time before saving to database.
     */
    @PrePersist
    protected void onCreate() {
        registeredAt = LocalDateTime.now();
    }

    // Getters and Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getAccountTier() { return accountTier; }
    public void setAccountTier(String accountTier) { this.accountTier = accountTier; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(String profilePhoto) { this.profilePhoto = profilePhoto; }

    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }

    public List<Account> getAccounts() { return accounts; }
    public void setAccounts(List<Account> accounts) { this.accounts = accounts; }
}
