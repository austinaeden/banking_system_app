package backend.tukproj.banking_system.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    @JsonBackReference(value = "admin-audit")
    private User admin;

    @Column(nullable = false, length = 255)
    private String action;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_account_id")
    @JsonBackReference(value = "account-audit")
    private Account targetAccount;

    @Column(name = "performed_at", insertable = false, updatable = false)
    private LocalDateTime performedAt;

    @PrePersist
    protected void onCreate() {
        performedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getAdmin() { return admin; }
    public void setAdmin(User admin) { this.admin = admin; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public Account getTargetAccount() { return targetAccount; }
    public void setTargetAccount(Account targetAccount) { this.targetAccount = targetAccount; }

    public LocalDateTime getPerformedAt() { return performedAt; }
    public void setPerformedAt(LocalDateTime performedAt) { this.performedAt = performedAt; }
}
