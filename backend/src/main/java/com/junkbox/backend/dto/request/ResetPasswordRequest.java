package com.junkbox.backend.dto.request;

import lombok.Getter;
import lombok.Setter;
import org.jspecify.annotations.Nullable;

@Getter
@Setter
public class ResetPasswordRequest {
    private String token;
    private String newPassword;

}
