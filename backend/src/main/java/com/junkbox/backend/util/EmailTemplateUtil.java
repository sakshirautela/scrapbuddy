package com.junkbox.backend.util;

import com.junkbox.backend.entity.Notification;
import com.junkbox.backend.entity.enums.NotificationType;

import java.time.format.DateTimeFormatter;

public class EmailTemplateUtil {

    private static final String BASE_COLOR = "#28a745";
    private static final String ACCENT_COLOR = "#007bff";

    public static String getEmailTemplate(
            String userName,
            NotificationType type,
            String subject,
            String orderDetails,
            String message) {

        String mainContent = getMainContent(type, orderDetails, message);

        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
                    .container { max-width: 600px; margin: 20px auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .header { background-color: """ + BASE_COLOR + """
                    ; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .header h1 { font-size: 28px; margin-bottom: 10px; }
                    .content { padding: 30px 20px; }
                    .greeting { color: #333; margin-bottom: 20px; font-size: 16px; }
                    .message-box { background-color: #f9f9f9; border-left: 4px solid """ + ACCENT_COLOR + """
                    ; padding: 15px; margin: 20px 0; border-radius: 4px; }
                    .order-details { background-color: #f0f0f0; padding: 15px; margin: 20px 0; border-radius: 4px; font-size: 14px; }
                    .order-details p { margin: 8px 0; }
                    .order-details strong { color: """ + BASE_COLOR + """
                     ; }
                    .status-badge { display: inline-block; background-color: """ + BASE_COLOR + """
                    ; color: white; padding: 8px 15px; border-radius: 20px; font-weight: bold; margin-top: 10px; }
                    .button { display: inline-block; background-color: """ + ACCENT_COLOR + """
                    ; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 20px; font-weight: bold; }
                    .button:hover { background-color: #0056b3; }
                    .footer { border-top: 1px solid #ddd; padding: 20px; text-align: center; font-size: 12px; color: #666; background-color: #f9f9f9; border-radius: 0 0 8px 8px; }
                    .divider { height: 1px; background-color: #ddd; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>JunkBox</h1>
                        <p>""" + subject +
                    """
                    </p>
                    </div>
                    <div class="content">
                        <div class="greeting">Hi """ + userName + """
                        ,
                        </div>
                        """ + mainContent + """
                        <div class="divider"></div>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 JunkBox. All rights reserved.</p>
                        <p>Questions? Contact us at support@junkbox.com</p>
                    </div>
                </div>
            </body>
            </html>
            """;
    }

    private static String getMainContent(
            NotificationType type,
            String orderDetails,
            String message) {

        return switch (type) {
            case ORDER_PLACED -> """
                    <p style="color: #333; margin-bottom: 15px;">Thank you for placing your order with JunkBox! We've received your order and are processing it.</p>
                    <div class="message-box">
                        """ + message + """
                    </div>
                    <div class="order-details">
                        <strong>Order Details:</strong>
                        """ + orderDetails + """
                    </div>
                    <p style="margin-top: 20px; color: #666;">You can track your order status in your JunkBox dashboard.</p>
                    """;

            case ORDER_ACCEPTED -> """
                    <p style="color: #333; margin-bottom: 15px;">Great news! Your order has been accepted by our team.</p>
                    <div class="message-box">
                        """ + message + """
                    </div>
                    <div class="order-details">
                        <strong>Order Status:</strong>
                        <span class="status-badge" style="background-color: #17a2b8;">Accepted</span>
                        """ + orderDetails + """
                    </div>
                    """;

            case ORDER_COMPLETED -> """
                    <p style="color: #333; margin-bottom: 15px;">Your order has been completed successfully!</p>
                    <div class="message-box">
                       \s""" + message + """
                    </div>
                    <div class="order-details">
                        <strong>Completion Details:</strong>
                       \s""" + orderDetails + """
                    </div>
                    <p style="margin-top: 20px; color: #666;">Thank you for using JunkBox!</p>
                    """;

            case PICKUP_SCHEDULED -> """
                    <p style="color: #333; margin-bottom: 15px;">Your pickup has been scheduled!</p>
                    <div class="message-box">
                        """ + message + """
                    </div>
                    <div class="order-details">
                        <strong>Pickup Details:</strong>
                        """ + orderDetails + """
                    </div>
                    <p style="margin-top: 20px; color: #666;">Please ensure someone is available during the scheduled time.</p>
                    """;

            case PICKUP_REMINDER -> """
                    <p style="color: #333; margin-bottom: 15px;">Reminder: Your pickup is scheduled soon!</p>
                    <div class="message-box">
                        """ + message + """
                    </div>
                    <div class="order-details">
                        <strong>Pickup Schedule:</strong>
                        """ + orderDetails + """
                    </div>
                    <p style="margin-top: 20px; color: #ff9800; font-weight: bold;">Please make sure you're ready!</p>
                    """;

            case ORDER_REJECTED -> """
                    <p style="color: #d32f2f; margin-bottom: 15px;">Unfortunately, your order could not be processed.</p>
                    <div class="message-box" style="border-left-color: #d32f2f; background-color: #ffebee;">
                        """ + message + """
                    </div>
                    <p style="margin-top: 20px; color: #666;">Please contact our support team for assistance.</p>
                    """;

            case ORDER_CANCELLED -> """
                    <p style="color: #ff9800; margin-bottom: 15px;">Your order has been cancelled.</p>
                    <div class="message-box">
                        """ + message + """
                    </div>
                    <div class="order-details">
                        <strong>Cancellation Details:</strong>
                        """ + orderDetails + """
                    </div>
                    """;

            default -> "<p style=\"color: #333;\">" + message + "</p>";
        };
    }

    public static String getPasswordResetTemplate(String userName, String otp, int validityMinutes) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
                    .container { max-width: 600px; margin: 20px auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                    .header { background-color: """ + BASE_COLOR + """
                    ; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { padding: 30px 20px; }
                    .otp-box { background-color: #f0f0f0; border: 2px solid """ + ACCENT_COLOR + """
                    ; padding: 20px; text-align: center; border-radius: 4px; margin: 20px 0; }
                    .otp-box .otp { font-size: 32px; font-weight: bold; color: """ + ACCENT_COLOR + """
                    ; letter-spacing: 5px; font-family: monospace; }
                    .warning { background-color: #fff3cd; border-left: 4px solid #ff9800; padding: 15px; margin: 20px 0; border-radius: 4px; color: #856404; }
                    .footer { border-top: 1px solid #ddd; padding: 20px; text-align: center; font-size: 12px; color: #666; background-color: #f9f9f9; border-radius: 0 0 8px 8px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>JunkBox</h1>
                        <p>Password Reset Request</p>
                    </div>
                    <div class="content">
                        <div style="color: #333;">Hi """ + userName + """
                        ,</div>
                        <p style="color: #333; margin: 20px 0;">We received a request to reset your JunkBox account password.</p>
                        <div class="otp-box">
                            <p style="color: #666; margin-bottom: 10px; font-size: 14px;">Your One-Time Password (OTP):</p>
                            <div class="otp">""" + otp + """
                        </div>
                        </div>
                        <p style="color: #333; text-align: center; margin: 20px 0;">This OTP is valid for """ + validityMinutes + """
                         minutes.</p>
                        <div class="warning">
                            <strong>⚠ Security Warning:</strong><br>
                            Do not share this OTP with anyone. JunkBox support will never ask for your OTP.
                        </div>
                        <p style="color: #666; margin-top: 20px;">If you did not request a password reset, please ignore this email and your password will remain unchanged.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 JunkBox. All rights reserved.</p>
                        <p>Questions? Contact us at support@junkbox.com</p>
                    </div>
                </div>
            </body>
            </html>
            """;
    }
}
