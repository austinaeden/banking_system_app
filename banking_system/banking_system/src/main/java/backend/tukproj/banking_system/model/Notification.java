package backend.tukproj.banking_system.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.format.DateTimeFormatter;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "notification_date", insertable = false, updatable = false)
    private LocalDate notificationDate;

    @Column(name = "notification_time", insertable = false, updatable = false)
    private LocalTime notificationTime;

    @PrePersist
    protected void onCreate() {
        notificationDate = LocalDate.now();
        notificationTime = LocalTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    @JsonProperty("date")
    public String getFormattedDate() {
        if (notificationDate != null) {
            return notificationDate.format(DateTimeFormatter.ofPattern("MMM dd, yyyy")).toUpperCase();
        }
        return null;
    }

    @JsonProperty("time")
    public String getFormattedTime() {
        if (notificationTime != null) {
            return notificationTime.format(DateTimeFormatter.ofPattern("HH:mm a"));
        }
        return null;
    }

    public LocalDate getNotificationDate() { return notificationDate; }
    public void setNotificationDate(LocalDate notificationDate) { this.notificationDate = notificationDate; }

    public LocalTime getNotificationTime() { return notificationTime; }
    public void setNotificationTime(LocalTime notificationTime) { this.notificationTime = notificationTime; }
}
