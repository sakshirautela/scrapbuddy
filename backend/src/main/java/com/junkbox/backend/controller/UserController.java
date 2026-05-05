package com.junkbox.backend.controller;

import com.junkbox.backend.entity.User;
import com.junkbox.backend.service.UserServiceImp;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.UUID;


@Component("/auth/user")
public class UserController {
//    UserServiceImp userServiceImp = new UserServiceImp();
//    @PostMapping("/resetPassword")
//    public GenericResponse resetPassword(HttpServletRequest request,
//                                         @RequestParam("email") String userEmail) {
//        User user = userServiceImp.findUserByEmail(userEmail);
//        if (user == null) {
//            throw new UserNotFoundException();
//        }
//        String token = UUID.randomUUID().toString();
//        userServiceImp.createPasswordResetTokenForUser(user, token);
//        mailSender.send(constructResetTokenEmail(getAppUrl(request),
//                request.getLocale(), token, user));
//        return new GenericResponse(
//                messages.createMessage("message.resetPasswordEmail", null
//                ));
//    }
}
