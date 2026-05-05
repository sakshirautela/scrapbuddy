package com.junkbox.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MailBody {
    private String to;
    private String subject;
    private String body;
}
