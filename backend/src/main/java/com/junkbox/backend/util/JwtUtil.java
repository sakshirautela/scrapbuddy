package com.junkbox.backend.util;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;

import javax.crypto.SecretKey;

import com.junkbox.backend.dto.response.UserResponse;
import com.junkbox.backend.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.util.Date;
import javax.crypto.SecretKey;

@Component
public class JwtUtil {
    private final SecretKey key;

    // Inject the secret string and decode it into a SecretKey
    public JwtUtil(@Value("${jwt.secret}") String secretString) {
        byte[] keyBytes = Decoders.BASE64.decode(secretString);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }


    public String generateToken(UserResponse user) {

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role", user.getRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

//
//import com.junkbox.backend.dto.response.UserResponse;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.io.Decoders;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//import java.util.Date;
//import javax.crypto.SecretKey;
//
//
//            // Inject the secret string and decode it into a SecretKey
//            public JwtUtil(@Value("${jwt.secret}") String secretString) {
//                byte[] keyBytes = Decoders.BASE64.decode(secretString);
//                this.key = Keys.hmacShaKeyFor(keyBytes);
//            }
//
//            public String generateToken(UserResponse user) {
//                return Jwts.builder().setSubject(user.getUsername())
//                        .claim("role", user.getRole())
//                        .setIssuedAt((new Date())
//               .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60))
//                        .signWith(key) // Inferred automatically from your HMAC key
//                        .compact();
//            }
//
//            public String extractUsername(String token) {
//                return Jwts.parser()
//                        .verifyWith(key)
//                        .build()
//                        .parseSignedClaims(token)
//                        .getPayload()
//                        .getSubject();
//            }
}
