package com.example.mobile

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import com.example.mobile.util.PreferencesManager

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val prefsManager = PreferencesManager(this)
        
        // Check if user is already logged in
        if (prefsManager.isLoggedIn()) {
            // User is logged in, go to Dashboard
            startActivity(Intent(this, DashboardActivity::class.java))
        } else {
            // User is not logged in, go to Login screen
            startActivity(Intent(this, LoginActivity::class.java))
        }
        
        finish()
    }
}
