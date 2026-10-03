package com.example.myapplication

import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.myapplication.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(onNavigate: (Screen) -> Unit) {
    val scrollState = rememberScrollState()

    Scaffold(
        containerColor = Violet900,
        bottomBar = { BottomNavBar(currentScreen = Screen.Home, onNavigate = onNavigate) },
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(padding),
        ) {
            // ── Header ──────────────────────────────────────────────
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 20.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column {
                    Text(
                        text  = "DISCOVER IN",
                        style = MaterialTheme.typography.labelSmall,
                        color = OnSurfaceLow,
                        letterSpacing = 1.5.sp,
                    )
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(4.dp),
                    ) {
                        Text(
                            text  = "Hyderabad",
                            style = MaterialTheme.typography.titleLarge,
                            color = OnSurface,
                        )
                        Icon(
                            Icons.Filled.KeyboardArrowDown,
                            contentDescription = null,
                            tint   = VioletLight,
                            modifier = Modifier.size(20.dp),
                        )
                    }
                }
                // Avatar
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .background(
                            brush = Brush.linearGradient(listOf(VioletPrimary, PinkAccent))
                        ),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        text  = "AM",
                        style = MaterialTheme.typography.labelLarge,
                        color = Color.White,
                    )
                }
            }

            // ── Search Bar ──────────────────────────────────────────
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(Surface2)
                    .padding(horizontal = 16.dp, vertical = 14.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Icon(Icons.Filled.Search, contentDescription = null, tint = OnSurfaceLow, modifier = Modifier.size(20.dp))
                Text(
                    text  = "Search events, artists or venues",
                    style = MaterialTheme.typography.bodyMedium,
                    color = OnSurfaceLow,
                )
            }

            Spacer(Modifier.height(28.dp))

            // ── Featured Events ─────────────────────────────────────
            SectionHeader(title = "Featured Events", actionLabel = "See all")

            Spacer(Modifier.height(14.dp))

            // Hero card
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .height(220.dp)
                    .clickable { onNavigate(Screen.Details) },
            ) {
                AsyncImage(
                    model  = "https://images.unsplash.com/photo-1764510377280-0d0b4c8f89e7?auto=format&fit=crop&w=1200&q=88",
                    contentDescription = "Neon Pulse concert",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize(),
                )
                // Gradient overlay
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                listOf(Color.Transparent, Color(0xCC0D0618)),
                                startY = 0f, endY = 600f,
                            )
                        )
                )
                // Badge
                Surface(
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(14.dp),
                    shape  = RoundedCornerShape(6.dp),
                    color  = VioletPrimary.copy(alpha = 0.9f),
                ) {
                    Text(
                        text     = "FEATURED",
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                        style    = MaterialTheme.typography.labelSmall,
                        color    = Color.White,
                        letterSpacing = 1.sp,
                    )
                }
                // Copy
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(16.dp),
                ) {
                    Text(
                        text  = "28 JUNE · HITEX",
                        style = MaterialTheme.typography.labelSmall,
                        color = OnSurfaceMid,
                        letterSpacing = 1.sp,
                    )
                    Text(
                        text  = "Neon Pulse Live",
                        style = MaterialTheme.typography.headlineMedium,
                        color = Color.White,
                    )
                }
                // Arrow
                Icon(
                    Icons.Filled.ChevronRight,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .padding(16.dp)
                        .size(22.dp),
                )
            }

            Spacer(Modifier.height(28.dp))

            // ── Categories ──────────────────────────────────────────
            SectionHeader(title = "Browse Categories")

            Spacer(Modifier.height(14.dp))

            val categories = listOf(
                Triple("Music",   "♫", VioletPrimary),
                Triple("Tech",    "⌁", CyanAccent),
                Triple("Sports",  "◉", LimeAccent),
                Triple("Comedy",  "☺", OrangeAccent),
            )
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                items(categories.size) { i ->
                    val (name, symbol, color) = categories[i]
                    CategoryChip(name = name, symbol = symbol, color = color)
                }
            }

            Spacer(Modifier.height(28.dp))

            // ── Recommended ─────────────────────────────────────────
            SectionHeader(title = "Recommended for you", actionLabel = "View all")

            Spacer(Modifier.height(14.dp))

            Column(
                modifier = Modifier.padding(horizontal = 20.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                EventListCard(
                    imageUrl = "https://images.unsplash.com/photo-1771918846209-c536b01e2729?auto=format&fit=crop&w=800&q=85",
                    day      = "28",
                    month    = "JUN",
                    title    = "Neon Pulse Live",
                    subtitle = "7:30 PM · HITEX Arena",
                    price    = "From ₹1,499",
                    onClick  = { onNavigate(Screen.Details) },
                )
                EventListCard(
                    imageUrl = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=85",
                    day      = "05",
                    month    = "JUL",
                    title    = "Future Shift 2025",
                    subtitle = "10:00 AM · HICC",
                    price    = "From ₹899",
                    onClick  = {},
                )
            }

            Spacer(Modifier.height(24.dp))
        }
    }
}

@Composable
private fun SectionHeader(title: String, actionLabel: String? = null) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            text  = title,
            style = MaterialTheme.typography.titleMedium,
            color = OnSurface,
        )
        if (actionLabel != null) {
            Text(
                text  = actionLabel,
                style = MaterialTheme.typography.bodyMedium,
                color = VioletLight,
            )
        }
    }
}

@Composable
private fun CategoryChip(name: String, symbol: String, color: Color) {
    Surface(
        shape  = RoundedCornerShape(14.dp),
        color  = color.copy(alpha = 0.15f),
        border = BorderStroke(1.dp, color.copy(alpha = 0.4f)),
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 18.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Text(text = symbol, fontSize = 18.sp, color = color)
            Text(
                text  = name,
                style = MaterialTheme.typography.titleMedium,
                color = color,
            )
        }
    }
}

@Composable
private fun EventListCard(
    imageUrl: String,
    day: String,
    month: String,
    title: String,
    subtitle: String,
    price: String,
    onClick: () -> Unit,
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape  = RoundedCornerShape(16.dp),
        color  = Surface1,
        border = BorderStroke(1.dp, Surface3),
    ) {
        Row(modifier = Modifier.height(96.dp)) {
            AsyncImage(
                model  = imageUrl,
                contentDescription = title,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .width(96.dp)
                    .fillMaxHeight()
                    .clip(RoundedCornerShape(topStart = 16.dp, bottomStart = 16.dp)),
            )
            Row(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 14.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                // Date box
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .background(Surface3)
                        .padding(horizontal = 10.dp, vertical = 8.dp),
                ) {
                    Text(text = day,   style = MaterialTheme.typography.titleLarge,  color = VioletLight, fontWeight = FontWeight.Black)
                    Text(text = month, style = MaterialTheme.typography.labelSmall,  color = OnSurfaceLow, letterSpacing = 1.sp)
                }
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(text = title,    style = MaterialTheme.typography.titleMedium, color = OnSurface)
                    Text(text = subtitle, style = MaterialTheme.typography.bodyMedium,  color = OnSurfaceLow)
                    Text(text = price,    style = MaterialTheme.typography.labelLarge,  color = VioletLight)
                }
            }
        }
    }
}
