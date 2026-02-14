package com.example.mobile

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import com.example.mobile.network.RetrofitClient
import com.example.mobile.util.PreferencesManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch

class DashboardActivity : Activity() {
    
    private val job = Job()
    private val scope = CoroutineScope(Dispatchers.Main + job)
    
    private lateinit var tvName: TextView
    private lateinit var tvEmail: TextView
    private lateinit var tvAge: TextView
    private lateinit var tvGender: TextView
    private lateinit var tvAddress: TextView
    private lateinit var llAge: LinearLayout
    private lateinit var llGender: LinearLayout
    private lateinit var llAddress: LinearLayout
    private lateinit var btnLogout: Button
    
    private lateinit var prefsManager: PreferencesManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_dashboard)
        
        prefsManager = PreferencesManager(this)
        
        // Check if user is logged in
        if (!prefsManager.isLoggedIn()) {
            navigateToLogin()
            return
        }
        
        initViews()
        setupListeners()
        loadUserProfile()
    }
    
    private fun initViews() {
        tvName = findViewById(R.id.tvName)
        tvEmail = findViewById(R.id.tvEmail)
        tvAge = findViewById(R.id.tvAge)
        tvGender = findViewById(R.id.tvGender)
        tvAddress = findViewById(R.id.tvAddress)
        llAge = findViewById(R.id.llAge)
        llGender = findViewById(R.id.llGender)
        llAddress = findViewById(R.id.llAddress)
        btnLogout = findViewById(R.id.btnLogout)
    }
    
    private fun setupListeners() {
        btnLogout.setOnClickListener {
            performLogout()
        }
    }
    
    private fun loadUserProfile() {
        // First, display cached data
        displayCachedUserData()
        
        // Then fetch fresh data from server
        val token = prefsManager.getAuthToken()
        if (token != null) {
            scope.launch {
                try {
                    val response = RetrofitClient.apiService.getCurrentUser("Bearer $token")
                    
                    if (response.isSuccessful && response.body() != null) {
                        val user = response.body()!!
                        
                        // Update cached data
                        prefsManager.saveUserData(
                            user.id,
                            user.firstName,
                            user.lastName,
                            user.email,
                            user.age,
                            user.gender,
                            user.address
                        )
                        
                        // Display fresh data
                        displayUserData(
                            user.firstName,
                            user.lastName,
                            user.email,
                            user.age,
                            user.gender,
                            user.address
                        )
                    } else if (response.code() == 401) {
                        // Token expired or invalid
                        Toast.makeText(this@DashboardActivity, "Session expired. Please login again.", Toast.LENGTH_LONG).show()
                        performLogout()
                    }
                } catch (e: Exception) {
                    // If network fails, we already have cached data displayed
                    Toast.makeText(this@DashboardActivity, "Using cached profile data", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
    
    private fun displayCachedUserData() {
        val firstName = prefsManager.getFirstName() ?: ""
        val lastName = prefsManager.getLastName() ?: ""
        val email = prefsManager.getEmail() ?: ""
        val age = prefsManager.getAge()
        val gender = prefsManager.getGender()
        val address = prefsManager.getAddress()
        
        displayUserData(firstName, lastName, email, if (age > 0) age else null, gender, address)
    }
    
    private fun displayUserData(
        firstName: String,
        lastName: String,
        email: String,
        age: Int?,
        gender: String?,
        address: String?
    ) {
        tvName.text = "$firstName $lastName"
        tvEmail.text = email
        
        if (age != null && age > 0) {
            tvAge.text = age.toString()
            llAge.visibility = View.VISIBLE
        } else {
            llAge.visibility = View.GONE
        }
        
        if (!gender.isNullOrEmpty()) {
            tvGender.text = gender
            llGender.visibility = View.VISIBLE
        } else {
            llGender.visibility = View.GONE
        }
        
        if (!address.isNullOrEmpty()) {
            tvAddress.text = address
            llAddress.visibility = View.VISIBLE
        } else {
            llAddress.visibility = View.GONE
        }
    }
    
    private fun performLogout() {
        prefsManager.clearAll()
        Toast.makeText(this, "Logged out successfully", Toast.LENGTH_SHORT).show()
        navigateToLogin()
    }
    
    private fun navigateToLogin() {
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }
    
    override fun onBackPressed() {
        // On dashboard, back button exits the app (don't go back to login)
        finishAffinity()
    }
    
    override fun onDestroy() {
        super.onDestroy()
        job.cancel()
    }
}
