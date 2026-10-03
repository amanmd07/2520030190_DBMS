import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:go_router/go_router.dart';

class TicketScreen extends StatelessWidget {
  final String bookingId;

  const TicketScreen({super.key, required this.bookingId});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: theme.colorScheme.primary,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.white,
        title: const Text('Digital Ticket'),
        elevation: 0,
      ),
      body: Center(
        child: Container(
          margin: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: theme.scaffoldBackgroundColor,
            borderRadius: BorderRadius.circular(24),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Ticket Header
              Container(
                height: 120,
                decoration: BoxDecoration(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
                  gradient: LinearGradient(
                    colors: [theme.colorScheme.secondaryContainer, theme.colorScheme.tertiaryContainer],
                  ),
                ),
                child: Center(
                  child: Icon(Icons.music_note, size: 60, color: theme.colorScheme.primary),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  children: [
                    Text(
                      'Live Music Night',
                      style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    const Text('KL Convention Hall, Hyderabad', style: TextStyle(color: Colors.grey)),
                    const SizedBox(height: 24),
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _TicketDetail(label: 'Date', value: '24 Oct 2024'),
                        _TicketDetail(label: 'Time', value: '19:00 PM'),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const _TicketDetail(label: 'Seat', value: 'Balcony A1'),
                        _TicketDetail(label: 'Booking ID', value: bookingId),
                      ],
                    ),
                    const SizedBox(height: 32),
                    // Dashed line
                    Row(
                      children: List.generate(
                        30,
                        (index) => Expanded(
                          child: Container(
                            color: index % 2 == 0 ? Colors.transparent : Colors.grey[300],
                            height: 2,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 32),
                    // QR Code
                    QrImageView(
                      data: '{"bookingId": "$bookingId", "eventId": 1}',
                      version: QrVersions.auto,
                      size: 200.0,
                    ),
                    const SizedBox(height: 16),
                    Text('Scan at entry gate', style: TextStyle(color: Colors.grey[600])),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _TicketDetail extends StatelessWidget {
  final String label;
  final String value;

  const _TicketDetail({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(color: Colors.grey, fontSize: 12)),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
      ],
    );
  }
}