package com.example.mobile

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import com.example.mobile.model.LoginRequest
import com.example.mobile.network.RetrofitClient
import com.example.mobile.util.PreferencesManager
import com.google.android.material.textfield.TextInputEditText
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch

class LoginActivity : Activity() {
    
    private val job = Job()
    private val scope = CoroutineScope(Dispatchers.Main + job)
    
    private lateinit var etEmail: TextInputEditText
    private lateinit var etPassword: TextInputEditText
    private lateinit var btnLogin: Button
    private lateinit var tvGoToRegister: TextView
    
    private lateinit var prefsManager: PreferencesManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        
        prefsManager = PreferencesManager(this)
        
        // Check if user is already logged in
        if (prefsManager.isLoggedIn()) {
            navigateToDashboard()
            return
        }
        
        initViews()
        setupListeners()
    }
    
    private fun initViews() {
        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)
        btnLogin = findViewById(R.id.btnLogin)
        tvGoToRegister = findViewById(R.id.tvGoToRegister)
    }
    
    private fun setupListeners() {
        btnLogin.setOnClickListener {
            performLogin()
        }
        
        tvGoToRegister.setOnClickListener {
            navigateToRegister()
        }
    }
    
    private fun navigateToRegister() {
        startActivity(Intent(this, RegisterActivity::class.java))
        finish()
    }
    
    override fun onBackPressed() {
        // On login screen, back button exits the app
        finishAffinity()
    }
    
    private fun performLogin() {
        val email = etEmail.text.toString().trim()
        val password = etPassword.text.toString()
        
        // Validation
        if (email.isEmpty()) {
            Toast.makeText(this, "Email is required", Toast.LENGTH_SHORT).show()
            return
        }
        
        if (password.isEmpty()) {
            Toast.makeText(this, "Password is required", Toast.LENGTH_SHORT).show()
            return
        }
        
        val request = LoginRequest(email = email, password = password)
        
        // Disable button during login
        btnLogin.isEnabled = false
        
        scope.launch {
            try {
                val response = RetrofitClient.apiService.login(request)
                
                if (response.isSuccessful && response.body() != null) {
                    val authResponse = response.body()!!
                    
                    // Save token and user data
                    prefsManager.saveAuthToken(authResponse.token)
                    prefsManager.saveUserData(
                        authResponse.id,
                        authResponse.firstName,
                        authResponse.lastName,
                        authResponse.email,
                        authResponse.age,
                        authResponse.gender,
                        authResponse.address
                    )
                    
                    Toast.makeText(this@LoginActivity, "Login successful!", Toast.LENGTH_SHORT).show()
                    navigateToDashboard()
                } else {
                    val errorBody = response.errorBody()?.string() ?: "Login failed"
                    Toast.makeText(this@LoginActivity, errorBody, Toast.LENGTH_LONG).show()
                    btnLogin.isEnabled = true
                }
            } catch (e: Exception) {
                Toast.makeText(this@LoginActivity, "Error: ${e.message}", Toast.LENGTH_LONG).show()
                btnLogin.isEnabled = true
            }
        }
    }
    
    private fun navigateToDashboard() {
        startActivity(Intent(this, DashboardActivity::class.java))
        finish()
    }
    
    override fun onDestroy() {
        super.onDestroy()
        job.cancel()
    }
}
