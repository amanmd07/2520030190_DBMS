package com.example.myapplication.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColors = darkColorScheme(
    primary         = VioletPrimary,
    onPrimary       = Color.White,
    primaryContainer= Violet700,
    onPrimaryContainer = VioletGlow,
    secondary       = PinkAccent,
    onSecondary     = Color.White,
    secondaryContainer = Color(0xFF5B1A3A),
    onSecondaryContainer = Color(0xFFFFC8E4),
    tertiary        = CyanAccent,
    onTertiary      = Color.Black,
    background      = Violet900,
    onBackground    = OnSurface,
    surface         = Surface1,
    onSurface       = OnSurface,
    surfaceVariant  = Surface2,
    onSurfaceVariant= OnSurfaceMid,
    outline         = Surface3,
    error           = Color(0xFFCF6679),
    onError         = Color.Black,
)

@Composable
fun MyApplicationTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColors,
        typography  = Typography,
        content     = content,
    )
}