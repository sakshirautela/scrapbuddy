package com.junkbox.backend.dto.request;

import com.junkbox.backend.entity.Notification;
import com.junkbox.backend.entity.enums.NotificationChannel;
import com.junkbox.backend.entity.enums.NotificationType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NotificationRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Notification type is required")
    private NotificationType type;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Message is required")
    private String message;

    @NotBlank(message = "Recipient is required")
    @Email(message = "Recipient must be a valid email address")
    private String recipient;

    @NotNull(message = "Channel is required")
    private NotificationChannel channel;
}
