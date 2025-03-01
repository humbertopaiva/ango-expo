// Path: src/lib/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export type StorageController = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

class CustomStorage implements StorageController {
  private isWeb = Platform.OS === "web";
  private webStorage =
    typeof localStorage !== "undefined" ? localStorage : null;

  async getItem(key: string): Promise<string | null> {
    try {
      if (this.isWeb) {
        return this.webStorage?.getItem(key) ?? null;
      }

      // Para dispositivos móveis, usamos AsyncStorage
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error("Error getting item from storage:", error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (this.isWeb) {
        this.webStorage?.setItem(key, value);
        return;
      }

      // Para dispositivos móveis, usamos AsyncStorage
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("Error setting item in storage:", error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      if (this.isWeb) {
        this.webStorage?.removeItem(key);
        return;
      }

      // Para dispositivos móveis, usamos AsyncStorage
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item from storage:", error);
    }
  }
}

export const storage = new CustomStorage();
