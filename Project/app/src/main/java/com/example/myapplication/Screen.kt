package com.example.myapplication

// Sealed class representing all navigation destinations
sealed class Screen(val route: String) {
    object Home    : Screen("home")
    object Details : Screen("details")
    object Seats   : Screen("seats")
    object Ticket  : Screen("ticket")
}
