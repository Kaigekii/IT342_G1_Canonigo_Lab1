package com.lab2.backend.controller;

import com.lab2.backend.dto.AuthDtos;
import com.lab2.backend.model.User;
import com.lab2.backend.repository.UserRepository;
import com.lab2.backend.security.TokenProvider;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          AuthenticationManager authenticationManager,
                          TokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already registered");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(
            request.getFirstName(),
            request.getLastName(),
            request.getAge(),
            request.getGender(),
            request.getAddress(),
            request.getEmail(),
            hashedPassword
        );
        userRepository.save(user);

        String token = tokenProvider.createToken(user);
        AuthDtos.AuthResponse response = new AuthDtos.AuthResponse(
            token,
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getAge(),
            user.getGender(),
            user.getAddress(),
            user.getEmail()
        );
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthDtos.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        org.springframework.security.core.userdetails.User principal =
                (org.springframework.security.core.userdetails.User) authentication.getPrincipal();

        User user = userRepository.findByEmail(principal.getUsername()).orElseThrow();
        String token = tokenProvider.createToken(user);
        AuthDtos.AuthResponse response = new AuthDtos.AuthResponse(
            token,
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getAge(),
            user.getGender(),
            user.getAddress(),
            user.getEmail()
        );
        return ResponseEntity.ok(response);
    }
}
