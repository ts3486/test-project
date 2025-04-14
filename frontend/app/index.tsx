import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/auth/AuthContext';
import { HomeScreen } from '../src/screens/HomeScreen';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <HomeScreen />;
} 