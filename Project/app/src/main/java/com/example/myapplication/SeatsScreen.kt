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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.myapplication.ui.theme.*

private val seatRows  = listOf("A", "B", "C", "D", "E", "F", "G")
private val soldSeats = setOf("A2","A7","B5","B8","C1","C6","D3","D9","E2","E7","F4","F8","G1","G6")

@Composable
fun SeatsScreen(
    onNavigate: (Screen) -> Unit,
    selected: List<String>,
    onSelectionChange: (List<String>) -> Unit,
) {
    val subtotal = selected.size * 1499

    Box(modifier = Modifier.fillMaxSize().background(Violet900)) {
        Column(modifier = Modifier.fillMaxSize()) {

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
                    onClick = { onNavigate(Screen.Details) },
                    modifier = Modifier.size(40.dp).clip(CircleShape).background(Surface2),
                ) {
                    Icon(Icons.Filled.ArrowBack, null, tint = OnSurface)
                }
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Select Seats", style = MaterialTheme.typography.titleMedium, color = OnSurface)
                    Text("Neon Pulse Live · 28 Jun", style = MaterialTheme.typography.bodyMedium, color = OnSurfaceLow)
                }
                Box(
                    modifier = Modifier.size(40.dp).clip(CircleShape).background(Surface2),
                    contentAlignment = Alignment.Center,
                ) {
                    Text("?", style = MaterialTheme.typography.titleMedium, color = OnSurfaceMid)
                }
            }

            Column(
                modifier = Modifier
                    .weight(1f)
                    .verticalScroll(rememberScrollState()),
            ) {
                Spacer(Modifier.height(12.dp))

                // ── Stage display ────────────────────────────────────
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(0.7f)
                            .height(10.dp)
                            .clip(RoundedCornerShape(bottomStart = 20.dp, bottomEnd = 20.dp))
                            .background(
                                Brush.horizontalGradient(listOf(VioletPrimary, PinkAccent, VioletPrimary))
                            ),
                    )
                    Spacer(Modifier.height(8.dp))
                    Text(
                        "STAGE",
                        style = MaterialTheme.typography.labelSmall,
                        color = OnSurfaceMid,
                        letterSpacing = 3.sp,
                    )
                    Text(
                        "All eyes this way",
                        style = MaterialTheme.typography.bodyMedium,
                        color = OnSurfaceLow,
                    )
                }

                Spacer(Modifier.height(24.dp))

                // ── Seat Map ─────────────────────────────────────────
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp),
                ) {
                    seatRows.forEach { row ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                        ) {
                            Text(
                                row,
                                modifier = Modifier.width(18.dp),
                                style = MaterialTheme.typography.labelSmall,
                                color = OnSurfaceLow,
                                textAlign = TextAlign.Center,
                            )
                            (1..9).forEach { num ->
                                val seatId = "$row$num"
                                val isSold     = seatId in soldSeats
                                val isSelected = seatId in selected
                                val isAisle    = num == 5

                                if (isAisle) Spacer(Modifier.width(10.dp))

                                SeatButton(
                                    label      = num.toString(),
                                    isSold     = isSold,
                                    isSelected = isSelected,
                                    onClick    = {
                                        if (!isSold) {
                                            val newList = if (isSelected)
                                                selected - seatId
                                            else
                                                selected + seatId
                                            onSelectionChange(newList)
                                        }
                                    },
                                )
                            }
                            Text(
                                row,
                                modifier = Modifier.width(18.dp),
                                style = MaterialTheme.typography.labelSmall,
                                color = OnSurfaceLow,
                                textAlign = TextAlign.Center,
                            )
                        }
                    }
                }

                Spacer(Modifier.height(20.dp))

                // ── Legend ───────────────────────────────────────────
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center,
                ) {
                    Row(horizontalArrangement = Arrangement.spacedBy(20.dp)) {
                        LegendItem(color = Surface2, border = Surface3, label = "Available")
                        LegendItem(color = VioletPrimary, border = VioletPrimary, label = "Selected")
                        LegendItem(color = Surface3, border = Surface3, label = "Sold")
                    }
                }

                Spacer(Modifier.height(120.dp))
            }
        }

        // ── Bottom Sheet ────────────────────────────────────────────
        Surface(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth(),
            color  = Surface1,
            shape  = RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp),
            shadowElevation = 24.dp,
        ) {
            Column(
                modifier = Modifier
                    .navigationBarsPadding()
                    .padding(horizontal = 20.dp, vertical = 20.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                // Grab handle
                Box(
                    modifier = Modifier
                        .width(40.dp).height(4.dp)
                        .clip(CircleShape)
                        .background(Surface3)
                        .align(Alignment.CenterHorizontally),
                )
                // Selection summary
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    Column {
                        Text(
                            "${selected.size} ${if (selected.size == 1) "ticket" else "tickets"} selected",
                            style = MaterialTheme.typography.bodyMedium, color = OnSurfaceLow,
                        )
                        Text(
                            if (selected.isEmpty()) "Choose your seats" else selected.joinToString(", "),
                            style = MaterialTheme.typography.titleMedium, color = OnSurface,
                        )
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text("Subtotal", style = MaterialTheme.typography.bodyMedium, color = OnSurfaceLow)
                        Text("₹${"%,d".format(subtotal)}", style = MaterialTheme.typography.titleMedium, color = VioletLight, fontWeight = FontWeight.Bold)
                    }
                }
                Button(
                    onClick  = { onNavigate(Screen.Ticket) },
                    enabled  = selected.isNotEmpty(),
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    shape    = RoundedCornerShape(14.dp),
                    colors   = ButtonDefaults.buttonColors(
                        containerColor         = VioletPrimary,
                        disabledContainerColor = Surface3,
                    ),
                ) {
                    Text("Continue", style = MaterialTheme.typography.titleMedium, color = Color.White)
                    Spacer(Modifier.width(6.dp))
                    Icon(Icons.Filled.ChevronRight, null, tint = Color.White, modifier = Modifier.size(18.dp))
                }
                Text(
                    "Taxes and fees will be added at checkout",
                    style = MaterialTheme.typography.bodyMedium,
                    color = OnSurfaceLow,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth(),
                )
            }
        }
    }
}

@Composable
private fun SeatButton(
    label: String,
    isSold: Boolean,
    isSelected: Boolean,
    onClick: () -> Unit,
) {
    val bgColor = when {
        isSold     -> Surface3
        isSelected -> VioletPrimary
        else       -> Surface2
    }
    val textColor = when {
        isSold     -> OnSurfaceLow
        isSelected -> Color.White
        else       -> OnSurfaceMid
    }
    Box(
        modifier = Modifier
            .size(30.dp)
            .clip(RoundedCornerShape(7.dp))
            .background(bgColor)
            .then(
                if (!isSold) Modifier.clickable(onClick = onClick)
                else Modifier
            ),
        contentAlignment = Alignment.Center,
    ) {
        Text(label, style = MaterialTheme.typography.labelSmall, color = textColor)
    }
}

@Composable
private fun LegendItem(color: Color, border: Color, label: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        Box(
            modifier = Modifier
                .size(14.dp)
                .clip(RoundedCornerShape(4.dp))
                .background(color)
                .border(1.dp, border, RoundedCornerShape(4.dp)),
        )
        Text(label, style = MaterialTheme.typography.bodyMedium, color = OnSurfaceLow)
    }
}
