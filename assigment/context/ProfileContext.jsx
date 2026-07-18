import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileContext = createContext();

export function useProfile() {
  return useContext(ProfileContext);
}

const defaultProfile = {
  name: "Prathvik Mehra",
  enrollment: "23CS001",
  photo: null,
};

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);

  // Load profile from AsyncStorage on mount
  useEffect(() => {
    async function loadProfile() {
      try {
        const stored = await AsyncStorage.getItem("profile");
        if (stored) {
          setProfile(JSON.parse(stored));
        }
      } catch (e) {
        console.warn("Error loading profile:", e);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  // Save profile to AsyncStorage whenever it changes
  useEffect(() => {
    async function saveProfile() {
      try {
        await AsyncStorage.setItem("profile", JSON.stringify(profile));
      } catch (e) {
        console.warn("Error saving profile:", e);
      }
    }

    if (!loading) {
      saveProfile();
    }
  }, [profile, loading]);

  const updateProfile = (newProfile) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
  };

  const value = {
    profile,
    setProfile: updateProfile,
    loading,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}
