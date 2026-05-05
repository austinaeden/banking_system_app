package backend.tukproj.banking_system.service;

import backend.tukproj.banking_system.model.Notification;
import backend.tukproj.banking_system.model.User;
import backend.tukproj.banking_system.repository.NotificationRepository;
import backend.tukproj.banking_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Notification> getNotificationsForUser(Long userId) {
        return notificationRepository.findByUser_IdOrderByNotificationDateDescNotificationTimeDesc(userId);
    }

    public void sendNotificationToAll(String title, String message) {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            Notification notif = new Notification();
            notif.setUser(user);
            notif.setName(title);
            notif.setMessage(message);
            notificationRepository.save(notif);
        }
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
