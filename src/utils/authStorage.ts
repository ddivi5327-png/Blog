import { Platform } from "react-native";

export const saveToken = async (token: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem("token", token);
    return;
  }

  const SecureStore = await import("expo-secure-store");
  await SecureStore.setItemAsync("token", token);
};

export const getToken = async () => {
  if (Platform.OS === "web") {
    return localStorage.getItem("token");
  }

  const SecureStore = await import("expo-secure-store");
  return await SecureStore.getItemAsync("token");
};

export const removeToken = async () => {
  if (Platform.OS === "web") {
    localStorage.removeItem("token");
    return;
  }

  const SecureStore = await import("expo-secure-store");
  await SecureStore.deleteItemAsync("token");
};
