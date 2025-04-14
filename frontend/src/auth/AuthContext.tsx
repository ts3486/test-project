import { createContext, useContext, useState, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const discovery = {
  authorizationEndpoint: 'https://dev-m3g03cgnow5x3x1i.jp.auth0.com/authorize',
  tokenEndpoint: 'https://dev-m3g03cgnow5x3x1i.jp.auth0.com/oauth/token',
  revocationEndpoint: 'https://dev-m3g03cgnow5x3x1i.jp.auth0.com/oauth/revoke',
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');
      if (token && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async () => {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'testproject1',
        path: 'auth/callback',
      });

      // For development, we'll use the Expo proxy URL
      const developmentRedirectUri = 'exp://localhost:19000/--/auth/callback';
      
      console.log('Auth0 Configuration:');
      console.log('Domain:', discovery.authorizationEndpoint);
      console.log('Redirect URI:', developmentRedirectUri);

      const authRequest = new AuthSession.AuthRequest({
        clientId: 'Om8vxQmndEPr3cnrG8hJaU54GLIteK6W',
        scopes: ['openid', 'profile', 'email'],
        redirectUri: developmentRedirectUri,
        usePKCE: true,
      });

      const result = await authRequest.promptAsync(discovery);
      console.log('Auth Result:', result);

      if (result.type === 'success') {
        const { access_token, id_token } = result.params;
        console.log('Access Token:', access_token);
        console.log('ID Token:', id_token);
        
        await AsyncStorage.setItem('auth_token', access_token);
        
        const userInfo = await fetchUserInfo(access_token);
        console.log('User Info:', userInfo);
        
        await AsyncStorage.setItem('user_data', JSON.stringify(userInfo));
        setUser(userInfo);
        setIsAuthenticated(true);
      } else {
        console.error('Auth failed:', result);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const fetchUserInfo = async (token: string) => {
    try {
      const response = await fetch('https://dev-m3g03cgnow5x3x1i.jp.auth0.com/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const getAccessToken = async () => {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    getAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 