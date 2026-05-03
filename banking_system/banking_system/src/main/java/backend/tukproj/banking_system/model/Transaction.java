package backend.tukproj.banking_system.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    @JsonBackReference
    private Account account;

    @Column(name = "recipient_info", nullable = false, length = 255)
    @JsonProperty("payee")
    private String recipientInfo;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    @Column(length = 100)
    private String category = "None";

    @Column(name = "transaction_date", insertable = false, updatable = false)
    private LocalDateTime transactionDate;

    @PrePersist
    protected void onCreate() {
        transactionDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    @JsonProperty("userId")
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    public Account getAccount() { return account; }
    public void setAccount(Account account) { this.account = account; }

    public String getRecipientInfo() { return recipientInfo; }
    public void setRecipientInfo(String recipientInfo) { this.recipientInfo = recipientInfo; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    @JsonProperty("date")
    public String getDateFormatted() {
        if (transactionDate != null) {
            return transactionDate.toLocalDate().toString();
        }
        return null;
    }

    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }
}
