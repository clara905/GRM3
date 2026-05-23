// src/navigation/AppNavigator.js

import React from 'react';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  createStackNavigator,
} from '@react-navigation/stack';

import {
  View,
  StyleSheet,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';

// =========================
// HOME
// =========================
import HomeScreen from '../screens/HomeScreen';

// =========================
// EXPLORE
// =========================
import ExploreScreen from '../screens/ExploreScreen';

// =========================
// CAR
// =========================
import CarDetailScreen from '../screens/CarDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import PaymentScreen from '../screens/PaymentScreen';

// =========================
// PROFILE
// =========================
import ProfileScreen from '../screens/ProfileScreen';
import RentalHistoryScreen from '../screens/RentalHistoryScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import TermsScreen from '../screens/TermsScreen';

// =========================
// AUTH
// =========================
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const C = {
  black: '#0A0A0A',
  red: '#FF1744',
  dark: '#1A1A1A',
};

// =========================
// HOME STACK
// =========================
function HomeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
      />

      <Stack.Screen
        name="CarDetail"
        component={CarDetailScreen}
      />

      <Stack.Screen
        name="Booking"
        component={BookingScreen}
      />

      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
      />
    </Stack.Navigator>
  );
}

// =========================
// EXPLORE STACK
// =========================
function ExploreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ExploreMain"
        component={ExploreScreen}
      />

      <Stack.Screen
        name="CarDetail"
        component={CarDetailScreen}
      />

      <Stack.Screen
        name="Booking"
        component={BookingScreen}
      />

      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
      />
    </Stack.Navigator>
  );
}

// =========================
// PROFILE STACK
// =========================
function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
      />

      <Stack.Screen
        name="RentalHistory"
        component={RentalHistoryScreen}
      />

      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
      />

      <Stack.Screen
        name="Terms"
        component={TermsScreen}
      />

      <Stack.Screen
        name="CarDetail"
        component={CarDetailScreen}
      />

      <Stack.Screen
        name="Booking"
        component={BookingScreen}
      />

      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
      />
    </Stack.Navigator>
  );
}

// =========================
// AUTH STACK
// =========================
function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />

      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
}

// =========================
// MAIN TABS
// =========================
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          backgroundColor: C.dark,
          borderTopColor: '#252525',
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
        },

        tabBarActiveTintColor: C.red,

        tabBarInactiveTintColor: '#444',

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.5,
        },

        tabBarIcon: ({
          focused,
          color,
        }) => {
          const icons = {
            Home: focused
              ? 'home'
              : 'home-outline',

            Explore: focused
              ? 'car-sport'
              : 'car-sport-outline',

            Profile: focused
              ? 'person'
              : 'person-outline',
          };

          return (
            <View
              style={[
                styles.tabIcon,

                focused &&
                  styles.tabIconActive,
              ]}
            >
              <Ionicons
                name={icons[route.name]}
                size={22}
                color={color}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
      />

      <Tab.Screen
        name="Explore"
        component={ExploreStack}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
}

// =========================
// APP NAVIGATOR
// =========================
export default function AppNavigator() {
  const { user } = useAuth();

  return user
    ? <MainTabs />
    : <AuthStack />;
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 36,
    height: 36,

    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 10,
  },

  tabIconActive: {
    backgroundColor:
      'rgba(255,23,68,0.15)',
  },
});