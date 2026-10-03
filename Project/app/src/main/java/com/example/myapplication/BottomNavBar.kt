package com.example.myapplication

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.example.myapplication.ui.theme.*

data class NavItem(
    val label: String,
    val icon: ImageVector,
    val selectedIcon: ImageVector,
    val screen: Screen,
)

val navItems = listOf(
    NavItem("Home",    Icons.Outlined.Home,           Icons.Filled.Home,           Screen.Home),
    NavItem("Explore", Icons.Outlined.Search,          Icons.Filled.Search,          Screen.Home),
    NavItem("Tickets", Icons.Outlined.ConfirmationNumber, Icons.Filled.ConfirmationNumber, Screen.Ticket),
    NavItem("Profile", Icons.Outlined.Person,          Icons.Filled.Person,          Screen.Home),
)

@Composable
fun BottomNavBar(
    currentScreen: Screen,
    onNavigate: (Screen) -> Unit,
) {
    NavigationBar(
        containerColor = Surface1,
        tonalElevation = 0.dp,
        modifier = Modifier
            .fillMaxWidth()
            .navigationBarsPadding(),
    ) {
        navItems.forEach { item ->
            val selected = when (item.screen) {
                Screen.Home   -> currentScreen == Screen.Home || currentScreen == Screen.Details || currentScreen == Screen.Seats
                Screen.Ticket -> currentScreen == Screen.Ticket
                else          -> false
            } && (item.label == "Home" && (currentScreen == Screen.Home || currentScreen == Screen.Details || currentScreen == Screen.Seats)
                || item.label == "Tickets" && currentScreen == Screen.Ticket)

            val isSelected = (item.label == "Home" && (currentScreen == Screen.Home || currentScreen == Screen.Details || currentScreen == Screen.Seats))
                || (item.label == "Tickets" && currentScreen == Screen.Ticket)

            NavigationBarItem(
                selected = isSelected,
                onClick  = { onNavigate(item.screen) },
                icon = {
                    Icon(
                        imageVector = if (isSelected) item.selectedIcon else item.icon,
                        contentDescription = item.label,
                    )
                },
                label = {
                    Text(
                        text  = item.label,
                        style = MaterialTheme.typography.labelSmall,
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor   = VioletLight,
                    selectedTextColor   = VioletLight,
                    unselectedIconColor = OnSurfaceLow,
                    unselectedTextColor = OnSurfaceLow,
                    indicatorColor      = Surface3,
                ),
            )
        }
    }
}
