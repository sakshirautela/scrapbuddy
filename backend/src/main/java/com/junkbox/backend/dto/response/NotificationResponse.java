package com.junkbox.backend.dto.response;

import com.junkbox.backend.entity.Notification;
import com.junkbox.backend.entity.enums.NotificationChannel;
import com.junkbox.backend.entity.enums.NotificationStatus;
import com.junkbox.backend.entity.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponse {

    private Long id;
    private Long userId;
    private Long orderId;
    private NotificationType type;
    private String subject;
    private String message;
    private String recipient;
    private NotificationChannel channel;
    private NotificationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime sentAt;
    private LocalDateTime readAt;
    private String errorMessage;

}
