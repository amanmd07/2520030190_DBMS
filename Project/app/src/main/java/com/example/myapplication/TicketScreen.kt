package com.example.myapplication

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.myapplication.ui.theme.*

@Composable
fun TicketScreen(
    onNavigate: (Screen) -> Unit,
    selected: List<String>,
) {
    val seats = selected.ifEmpty { listOf("C4", "C5") }.joinToString(", ")

    Scaffold(
        containerColor = Violet900,
        bottomBar = { BottomNavBar(currentScreen = Screen.Ticket, onNavigate = onNavigate) },
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(padding),
        ) {
            // ── Header ──────────────────────────────────────────────
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .statusBarsPadding()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                IconButton(
                    onClick = { onNavigate(Screen.Home) },
                    modifier = Modifier.size(40.dp).clip(CircleShape).background(Surface2),
                ) {
                    Icon(Icons.Filled.ArrowBack, null, tint = OnSurface)
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Your Ticket", style = MaterialTheme.typography.titleMedium, color = OnSurface)
                    Text("Ready when you are", style = MaterialTheme.typography.bodyMedium, color = OnSurfaceLow)
                }
                IconButton(
                    onClick = {},
                    modifier = Modifier.size(40.dp).clip(CircleShape).background(Surface2),
                ) {
                    Icon(Icons.Filled.Share, null, tint = OnSurface)
                }
            }

            Spacer(Modifier.height(8.dp))

            // ── Confirmed badge ─────────────────────────────────────
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = SuccessGreen.copy(alpha = 0.15f),
                    border = BorderStroke(1.dp, SuccessGreen.copy(0.4f)),
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        Box(Modifier.size(8.dp).clip(CircleShape).background(SuccessGreen))
                        Text(
                            "BOOKING CONFIRMED",
                            style = MaterialTheme.typography.labelLarge,
                            color = SuccessGreen,
                            letterSpacing = 1.sp,
                        )
                    }
                }
            }

            Spacer(Modifier.height(20.dp))

            // ── Ticket Pass Card ─────────────────────────────────────
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                shape  = RoundedCornerShape(24.dp),
                color  = Surface1,
                border = BorderStroke(1.dp, Surface3),
            ) {
                Column {
                    // Event image + info
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.spacedBy(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        AsyncImage(
                            model  = "https://images.unsplash.com/photo-1771918846209-c536b01e2729?auto=format&fit=crop&w=400&q=85",
                            contentDescription = "Event",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.size(80.dp).clip(RoundedCornerShape(14.dp)),
                        )
                        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text(
                                "28 JUNE 2025",
                                style = MaterialTheme.typography.labelSmall,
                                color = VioletLight,
                                letterSpacing = 1.sp,
                            )
                            Text(
                                "Neon Pulse\nLive",
                                style = MaterialTheme.typography.headlineMedium,
                                color = Color.White,
                            )
                            Text(
                                "HITEX Arena · 7:30 PM",
                                style = MaterialTheme.typography.bodyMedium,
                                color = OnSurfaceLow,
                            )
                        }
                    }

                    // Perforated divider
                    PerforationDivider()

                    // QR Code area
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        QrCodeComposable()
                        Text(
                            "Scan at entry",
                            style = MaterialTheme.typography.titleMedium,
                            color = OnSurface,
                        )
                        Text(
                            "Keep the code clearly visible",
                            style = MaterialTheme.typography.bodyMedium,
                            color = OnSurfaceLow,
                        )
                    }

                    // Perforated divider
                    PerforationDivider()

                    // Meta info grid
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 20.dp, vertical = 16.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                    ) {
                        TicketMetaItem(label = "GUEST",  value = "Arjun Mehta")
                        TicketMetaItem(label = "SEATS",  value = seats)
                        TicketMetaItem(label = "ZONE",   value = "Platinum")
                        TicketMetaItem(label = "GATE",   value = "Gate 03")
                    }

                    HorizontalDivider(color = Surface3, modifier = Modifier.padding(horizontal = 20.dp))

                    // Booking ID
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 20.dp, vertical = 14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text("BOOKING ID", style = MaterialTheme.typography.labelSmall, color = OnSurfaceLow, letterSpacing = 1.sp)
                        Text("NPL-8X42-190", style = MaterialTheme.typography.titleMedium, color = VioletLight)
                    }
                }
            }

            Spacer(Modifier.height(16.dp))

            Text(
                "Present this ticket at the venue entrance.\nA screenshot works offline too.",
                style = MaterialTheme.typography.bodyMedium,
                color = OnSurfaceLow,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth().padding(horizontal = 20.dp),
            )

            Spacer(Modifier.height(24.dp))
        }
    }
}

@Composable
private fun PerforationDivider() {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            modifier = Modifier
                .size(20.dp)
                .offset(x = (-10).dp)
                .clip(CircleShape)
                .background(Violet900),
        )
        Box(
            modifier = Modifier
                .weight(1f)
                .height(1.dp)
                .background(
                    Brush.horizontalGradient(
                        listOf(Surface3, Surface3, Surface3),
                    )
                ),
        )
        Box(
            modifier = Modifier
                .size(20.dp)
                .offset(x = 10.dp)
                .clip(CircleShape)
                .background(Violet900),
        )
    }
}

@Composable
private fun TicketMetaItem(label: String, value: String) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(4.dp),
    ) {
        Text(label, style = MaterialTheme.typography.labelSmall, color = OnSurfaceLow, letterSpacing = 1.sp)
        Text(value, style = MaterialTheme.typography.titleMedium, color = OnSurface)
    }
}

@Composable
private fun QrCodeComposable() {
    val cells = remember {
        buildList {
            fun finder(x: Int, y: Int, ox: Int, oy: Int): Boolean {
                val dx = x - ox; val dy = y - oy
                return dx in 0..6 && dy in 0..6 &&
                    (dx == 0 || dx == 6 || dy == 0 || dy == 6 || (dx in 2..4 && dy in 2..4))
            }
            for (i in 0 until 441) {
                val x = i % 21; val y = i / 21
                add(
                    finder(x, y, 0, 0) || finder(x, y, 14, 0) || finder(x, y, 0, 14) ||
                    ((x * 7 + y * 11 + x * y) % 5 < 2 &&
                        !((x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12)))
                )
            }
        }
    }
    Box(
        modifier = Modifier
            .size(180.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(Color.White)
            .padding(10.dp),
    ) {
        Column {
            (0 until 21).forEach { row ->
                Row {
                    (0 until 21).forEach { col ->
                        val dark = cells[row * 21 + col]
                        Box(
                            modifier = Modifier
                                .size(7.6.dp)
                                .background(if (dark) Color.Black else Color.White),
                        )
                    }
                }
            }
        }
    }
}
