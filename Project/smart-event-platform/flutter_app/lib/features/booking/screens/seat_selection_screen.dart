import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class SeatSelectionScreen extends ConsumerStatefulWidget {
  final String eventId;

  const SeatSelectionScreen({super.key, required this.eventId});

  @override
  ConsumerState<SeatSelectionScreen> createState() => _SeatSelectionScreenState();
}

class _SeatSelectionScreenState extends ConsumerState<SeatSelectionScreen> {
  final List<String> selectedSeats = [];
  final double pricePerSeat = 199.0;

  // Dummy data for visual layout
  final List<List<int>> seatLayout = [
    [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
    [1, 1, 2, 2, 0, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [2, 2, 1, 1, 1, 1, 1, 1, 2, 2],
  ]; // 0 = empty space, 1 = available, 2 = sold

  void _toggleSeat(String seatId) {
    setState(() {
      if (selectedSeats.contains(seatId)) {
        selectedSeats.remove(seatId);
      } else {
        selectedSeats.add(seatId);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Select Seats'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          const SizedBox(height: 20),
          // Stage representation
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 40),
            child: Container(
              height: 40,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [theme.colorScheme.primary.withOpacity(0.1), theme.colorScheme.primary.withOpacity(0.5)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
                borderRadius: const BorderRadius.vertical(top: Radius.circular(50)),
              ),
              child: const Center(child: Text('STAGE', style: TextStyle(fontWeight: FontWeight.bold))),
            ),
          ),
          const SizedBox(height: 40),

          // Seat Grid
          Expanded(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: List.generate(seatLayout.length, (rowIndex) {
                    return Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(seatLayout[rowIndex].length, (colIndex) {
                        final status = seatLayout[rowIndex][colIndex];
                        if (status == 0) return const SizedBox(width: 30, height: 30);

                        final seatId = '${String.fromCharCode(65 + rowIndex)}${colIndex + 1}';
                        final isSelected = selectedSeats.contains(seatId);

                        return GestureDetector(
                          onTap: status == 1 ? () => _toggleSeat(seatId) : null,
                          child: Container(
                            margin: const EdgeInsets.all(4),
                            width: 30,
                            height: 30,
                            decoration: BoxDecoration(
                              color: status == 2
                                  ? Colors.grey[300]
                                  : isSelected ? theme.colorScheme.primary : Colors.white,
                              border: Border.all(
                                color: status == 2 ? Colors.grey[400]! : theme.colorScheme.primary,
                                width: 2,
                              ),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Center(
                              child: Text(
                                seatId,
                                style: TextStyle(
                                  fontSize: 10,
                                  color: status == 2
                                      ? Colors.grey[500]
                                      : isSelected ? Colors.white : theme.colorScheme.primary,
                                ),
                              ),
                            ),
                          ),
                        );
                      }),
                    );
                  }),
                ),
              ),
            ),
          ),

          // Legend
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildLegendItem(context, 'Available', Colors.white, theme.colorScheme.primary),
                _buildLegendItem(context, 'Selected', theme.colorScheme.primary, theme.colorScheme.primary),
                _buildLegendItem(context, 'Sold', Colors.grey[300]!, Colors.grey[400]!),
              ],
            ),
          ),
        ],
      ),
      bottomSheet: selectedSeats.isEmpty ? null : Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: theme.scaffoldBackgroundColor,
          boxShadow: [
            BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5)),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('${selectedSeats.length} Seats Selected', style: theme.textTheme.titleMedium),
                Text(
                  '₹ ${selectedSeats.length * pricePerSeat}',
                  style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold, color: theme.colorScheme.primary),
                ),
              ],
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  // Navigate to booking summary / payment
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Proceeding to payment... (Demo)')),
                  );
                },
                child: const Text('Continue to Payment'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLegendItem(BuildContext context, String label, Color color, Color borderColor) {
    return Row(
      children: [
        Container(
          width: 20,
          height: 20,
          decoration: BoxDecoration(
            color: color,
            border: Border.all(color: borderColor, width: 2),
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        const SizedBox(width: 8),
        Text(label, style: const TextStyle(fontSize: 12)),
      ],
    );
  }
}