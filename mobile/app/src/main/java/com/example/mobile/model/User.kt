package com.example.mobile.model

data class User(
    val id: Long,
    val firstName: String,
    val lastName: String,
    val age: Int?,
    val gender: String?,
    val address: String?,
    val email: String
)

data class RegisterRequest(
    val firstName: String,
    val lastName: String,
    val age: Int?,
    val gender: String?,
    val address: String?,
    val email: String,
    val password: String
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class AuthResponse(
    val token: String,
    val id: Long,
    val firstName: String,
    val lastName: String,
    val age: Int?,
    val gender: String?,
    val address: String?,
    val email: String
)
