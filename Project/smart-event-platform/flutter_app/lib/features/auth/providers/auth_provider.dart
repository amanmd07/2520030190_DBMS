import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../../core/network/api_client.dart';

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return AuthNotifier(apiClient);
});

class AuthState {
  final bool isLoading;
  final bool isAuthenticated;
  final String? error;

  AuthState({this.isLoading = false, this.isAuthenticated = false, this.error});
}

class AuthNotifier extends StateNotifier<AuthState> {
  final ApiClient _apiClient;
  final _storage = const FlutterSecureStorage();

  AuthNotifier(this._apiClient) : super(AuthState()) {
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    final token = await _storage.read(key: 'jwt_token');
    if (token != null) {
      state = AuthState(isAuthenticated: true);
    }
  }

  Future<bool> login(String email, String password) async {
    state = AuthState(isLoading: true);
    try {
      final response = await _apiClient.client.post(
        '/auth/login',
        data: {
          'username': email,
          'password': password,
        },
        options: Options(contentType: 'application/x-www-form-urlencoded'),
      );

      final token = response.data['access_token'];
      await _storage.write(key: 'jwt_token', value: token);

      state = AuthState(isAuthenticated: true);
      return true;
    } catch (e) {
      state = AuthState(error: 'Invalid credentials or server offline');
      return false;
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: 'jwt_token');
    state = AuthState(isAuthenticated: false);
  }
}