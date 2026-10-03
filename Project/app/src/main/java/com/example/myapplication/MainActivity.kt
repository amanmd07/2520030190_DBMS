package com.example.myapplication

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.*
import androidx.compose.animation.core.tween
import androidx.compose.runtime.*
import com.example.myapplication.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                AppNavHost()
            }
        }
    }
}

@Composable
fun AppNavHost() {
    var currentScreen by remember { mutableStateOf<Screen>(Screen.Home) }
    var selectedSeats  by remember { mutableStateOf(listOf("C4", "C5")) }

    val navigate: (Screen) -> Unit = { screen -> currentScreen = screen }

    AnimatedContent(
        targetState = currentScreen,
        transitionSpec = {
            val enter = slideInHorizontally(tween(300)) { if (targetState.ordinal > initialState.ordinal) it else -it } +
                        fadeIn(tween(300))
            val exit  = slideOutHorizontally(tween(300)) { if (targetState.ordinal > initialState.ordinal) -it else it } +
                        fadeOut(tween(300))
            enter togetherWith exit
        },
        label = "screen_transition",
    ) { screen ->
        when (screen) {
            Screen.Home    -> HomeScreen(onNavigate = navigate)
            Screen.Details -> DetailsScreen(onNavigate = navigate)
            Screen.Seats   -> SeatsScreen(
                onNavigate       = navigate,
                selected         = selectedSeats,
                onSelectionChange = { selectedSeats = it },
            )
            Screen.Ticket  -> TicketScreen(onNavigate = navigate, selected = selectedSeats)
        }
    }
}

// Extension to get ordinal for animation direction
private val Screen.ordinal: Int get() = when (this) {
    Screen.Home    -> 0
    Screen.Details -> 1
    Screen.Seats   -> 2
    Screen.Ticket  -> 3
}