import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(icon: const Icon(Icons.settings), onPressed: () {}),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 24),
            CircleAvatar(
              radius: 50,
              backgroundColor: theme.colorScheme.primaryContainer,
              child: Text(
                'U',
                style: TextStyle(fontSize: 40, color: theme.colorScheme.onPrimaryContainer),
              ),
            ),
            const SizedBox(height: 16),
            Text('Regular User', style: theme.textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text('user@example.com', style: TextStyle(color: Colors.grey[600])),
            const SizedBox(height: 32),
            _buildProfileMenu(context, Icons.person_outline, 'Edit Profile'),
            _buildProfileMenu(context, Icons.favorite_border, 'Favorites'),
            _buildProfileMenu(context, Icons.payment, 'Payment Methods'),
            _buildProfileMenu(context, Icons.notifications_none, 'Notifications'),
            const Divider(),
            _buildProfileMenu(context, Icons.help_outline, 'Help & Support'),
            _buildProfileMenu(context, Icons.privacy_tip_outlined, 'Terms & Privacy'),
            _buildProfileMenu(context, Icons.dashboard, 'Admin Dashboard', route: '/admin'),
            _buildProfileMenu(context, Icons.dashboard_customize, 'Organizer Dashboard', route: '/organizer'),
            _buildProfileMenu(context, Icons.logout, 'Logout', isDestructive: true),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileMenu(BuildContext context, IconData icon, String title, {bool isDestructive = false, String? route}) {
    final theme = Theme.of(context);
    final color = isDestructive ? Colors.red : theme.colorScheme.onSurface;

    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: isDestructive ? Colors.red.withOpacity(0.1) : theme.colorScheme.surfaceVariant,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(icon, color: color),
      ),
      title: Text(title, style: TextStyle(color: color, fontWeight: FontWeight.w500)),
      trailing: const Icon(Icons.chevron_right, color: Colors.grey),
      onTap: () {
        if (isDestructive) {
          context.go('/login');
        } else if (route != null) {
          context.push(route);
        }
      },
    );
  }
}