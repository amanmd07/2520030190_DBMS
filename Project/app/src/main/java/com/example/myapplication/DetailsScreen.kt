package com.example.myapplication

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.myapplication.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DetailsScreen(onNavigate: (Screen) -> Unit) {
    val scrollState = rememberScrollState()

    Box(modifier = Modifier.fillMaxSize().background(Violet900)) {
        Column(modifier = Modifier.fillMaxSize().verticalScroll(scrollState)) {

            // ── Hero Image ──────────────────────────────────────────
            Box(modifier = Modifier.fillMaxWidth().height(320.dp)) {
                AsyncImage(
                    model  = "https://images.unsplash.com/photo-1764510377280-0d0b4c8f89e7?auto=format&fit=crop&w=1200&q=88",
                    contentDescription = "Neon Pulse Live concert",
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize(),
                )
                // Dark gradient overlay
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.verticalGradient(
                                listOf(Color(0x66000000), Color(0xFF0D0618)),
                                startY = 100f, endY = 900f,
                            )
                        )
                )
                // Top actions
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .statusBarsPadding()
                        .padding(16.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    IconButton(
                        onClick = { onNavigate(Screen.Home) },
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .background(Color.Black.copy(alpha = 0.4f)),
                    ) {
                        Icon(Icons.Filled.ArrowBack, contentDescription = "Back", tint = Color.White)
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        IconButton(
                            onClick = {},
                            modifier = Modifier.size(40.dp).clip(CircleShape).background(Color.Black.copy(0.4f)),
                        ) { Icon(Icons.Filled.Share, null, tint = Color.White) }
                        IconButton(
                            onClick = {},
                            modifier = Modifier.size(40.dp).clip(CircleShape).background(Color.Black.copy(0.4f)),
                        ) { Icon(Icons.Filled.FavoriteBorder, null, tint = Color.White) }
                    }
                }
                // Genre badge
                Row(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(20.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    Box(
                        Modifier.size(6.dp).clip(CircleShape).background(VioletLight)
                    )
                    Text(
                        "ELECTRONIC · LIVE",
                        style = MaterialTheme.typography.labelSmall,
                        color = VioletLight,
                        letterSpacing = 1.sp,
                    )
                }
            }

            // ── Content ─────────────────────────────────────────────
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
            ) {
                Spacer(Modifier.height(20.dp))

                Text(
                    text  = "Neon Pulse Live",
                    style = MaterialTheme.typography.headlineLarge,
                    color = Color.White,
                )

                Spacer(Modifier.height(8.dp))

                // Rating row
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(10.dp),
                ) {
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0x33FACC15),
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(4.dp),
                        ) {
                            Icon(Icons.Filled.Star, null, tint = Gold, modifier = Modifier.size(14.dp))
                            Text("4.8", style = MaterialTheme.typography.labelLarge, color = Gold)
                        }
                    }
                    Text("2.4k ratings", style = MaterialTheme.typography.bodyMedium, color = OnSurfaceLow)
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Surface3,
                    ) {
                        Text(
                            "16+",
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            style = MaterialTheme.typography.labelLarge,
                            color = OnSurfaceMid,
                        )
                    }
                }

                Spacer(Modifier.height(20.dp))

                // Info rows
                InfoRow(
                    icon    = Icons.Filled.CalendarToday,
                    primary = "Saturday, 28 June",
                    secondary = "7:30 PM – 11:30 PM",
                )
                Spacer(Modifier.height(12.dp))
                InfoRow(
                    icon    = Icons.Filled.LocationOn,
                    primary = "HITEX Exhibition Center",
                    secondary = "Madhapur, Hyderabad",
                    showChevron = true,
                )

                Spacer(Modifier.height(20.dp))
                HorizontalDivider(color = Surface3)
                Spacer(Modifier.height(20.dp))

                // About
                Text("About the event", style = MaterialTheme.typography.titleMedium, color = OnSurface)
                Spacer(Modifier.height(8.dp))
                Text(
                    "Step into a world where sound meets light. Neon Pulse brings together global electronic artists, immersive visuals, and a high-energy crowd for one unforgettable night.",
                    style = MaterialTheme.typography.bodyLarge,
                    color = OnSurfaceLow,
                )
                Spacer(Modifier.height(8.dp))
                Text("Read more", style = MaterialTheme.typography.bodyMedium, color = VioletLight)

                Spacer(Modifier.height(20.dp))

                // Artist card
                Surface(
                    shape  = RoundedCornerShape(16.dp),
                    color  = Surface1,
                    border = BorderStroke(1.dp, Surface3),
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(14.dp),
                    ) {
                        AsyncImage(
                            model = "https://images.unsplash.com/photo-1782737382701-1a63009882b0?auto=format&fit=crop&w=200&q=85",
                            contentDescription = "Artist",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.size(64.dp).clip(RoundedCornerShape(12.dp)),
                        )
                        Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                            Text("HEADLINER", style = MaterialTheme.typography.labelSmall, color = VioletLight, letterSpacing = 1.sp)
                            Text("Aria Voss", style = MaterialTheme.typography.titleMedium, color = OnSurface)
                            Text("Berlin · Electronic", style = MaterialTheme.typography.bodyMedium, color = OnSurfaceLow)
                        }
                        Button(
                            onClick = {},
                            shape  = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Surface3),
                            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                        ) {
                            Text("Follow", style = MaterialTheme.typography.labelLarge, color = VioletLight)
                        }
                    }
                }

                // Space for sticky CTA
                Spacer(Modifier.height(100.dp))
            }
        }

        // ── Sticky CTA ──────────────────────────────────────────────
        Surface(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth(),
            color = Surface1.copy(alpha = 0.96f),
            shadowElevation = 16.dp,
        ) {
            Row(
                modifier = Modifier
                    .navigationBarsPadding()
                    .padding(horizontal = 20.dp, vertical = 14.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Column {
                    Text("Starts from", style = MaterialTheme.typography.bodyMedium, color = OnSurfaceLow)
                    Text("₹1,499", style = MaterialTheme.typography.headlineMedium, color = OnSurface)
                }
                Button(
                    onClick = { onNavigate(Screen.Seats) },
                    shape  = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = VioletPrimary,
                    ),
                    contentPadding = PaddingValues(horizontal = 28.dp, vertical = 14.dp),
                ) {
                    Text("Book Now", style = MaterialTheme.typography.titleMedium, color = Color.White)
                    Spacer(Modifier.width(6.dp))
                    Icon(Icons.Filled.ChevronRight, null, tint = Color.White, modifier = Modifier.size(18.dp))
                }
            }
        }
    }
}

@Composable
private fun InfoRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    primary: String,
    secondary: String,
    showChevron: Boolean = false,
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Surface1)
            .padding(14.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        Box(
            modifier = Modifier
                .size(42.dp)
                .clip(RoundedCornerShape(10.dp))
                .background(Surface3),
            contentAlignment = Alignment.Center,
        ) {
            Icon(icon, null, tint = VioletLight, modifier = Modifier.size(20.dp))
        }
        Column(modifier = Modifier.weight(1f)) {
            Text(primary,   style = MaterialTheme.typography.titleMedium, color = OnSurface)
            Text(secondary, style = MaterialTheme.typography.bodyMedium,  color = OnSurfaceLow)
        }
        if (showChevron) {
            Icon(Icons.Filled.ChevronRight, null, tint = OnSurfaceLow, modifier = Modifier.size(20.dp))
        }
    }
}
