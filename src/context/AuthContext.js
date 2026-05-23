import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // USER
  const [user, setUser] = useState(null);

  // FAVORITES
  const [favorites, setFavorites] = useState([]);

  // RENTAL HISTORY
  const [rentals, setRentals] = useState([
    {
      id: 'GW-A1B2C3D4',
      carName: 'Porsche 911 Turbo S',
      carBrand: 'Porsche',
      carImage:
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
      startDate: '15 Apr 2026',
      endDate: '17 Apr 2026',
      days: 2,
      total: 13600000,
      status: 'completed',
      rating: 5,
      paymentMethod: 'gopay',
      orderId: 'GW-A1B2C3D4',
    },
    {
      id: 'GW-E5F6G7H8',
      carName: 'Lamborghini Huracán',
      carBrand: 'Lamborghini',
      carImage:
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
      startDate: '21 Mei 2026',
      endDate: '23 Mei 2026',
      days: 2,
      total: 17000000,
      status: 'active',
      rating: null,
      paymentMethod: 'bca_va',
      orderId: 'GW-E5F6G7H8',
    },
    {
      id: 'GW-I9J0K1L2',
      carName: 'Ferrari 488 GTB',
      carBrand: 'Ferrari',
      carImage:
        'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800',
      startDate: '02 Mar 2026',
      endDate: '03 Mar 2026',
      days: 1,
      total: 9200000,
      status: 'completed',
      rating: 4,
      paymentMethod: 'credit_card',
      orderId: 'GW-I9J0K1L2',
    },
  ]);

  // LOGIN
  const login = (email, password) => {
    if (email && password.length >= 6) {
      setUser({
        name: 'Arya Dwiputra',
        email,
        member: 'Gold',
      });

      return true;
    }

    return false;
  };

  // REGISTER
  const register = (userData) => {
    setUser({
      name: userData.name,
      email: userData.email,
      member: userData.member || 'Silver',
    });

    return true;
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
  };

  // FAVORITES
  const toggleFavorite = (car) => {
    setFavorites((prev) => {
      const exists = prev.find((f) => f.id === car.id);

      if (exists) {
        return prev.filter((f) => f.id !== car.id);
      }

      return [...prev, car];
    });
  };

  // CHECK FAVORITE
  const isFavorite = (carId) => {
    return favorites.some((f) => f.id === carId);
  };

  // ADD RENTAL
  const addRental = (rental) => {
    setRentals((prev) => [rental, ...prev]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,

        favorites,
        toggleFavorite,
        isFavorite,

        rentals,
        addRental,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);