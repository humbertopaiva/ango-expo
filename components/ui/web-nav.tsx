// src/components/ui/web-nav.tsx
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Link } from "expo-router";
import { Store, Truck, FileText } from "lucide-react-native";

export function WebNav() {
  if (Platform.OS !== "web") return null;

  return (
    <View className="hidden md:flex border-b border-gray-200 bg-white">
      <View className="max-w-7xl mx-auto w-full">
        <View className="flex-row items-center justify-center space-x-8 py-4">
          <Link href="/(public)/comercio-local/index" asChild>
            <TouchableOpacity className="flex-row items-center space-x-2">
              <Store size={20} />
              <Text>Comércio Local</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(public)/delivery/index" asChild>
            <TouchableOpacity className="flex-row items-center space-x-2">
              <Truck size={20} />
              <Text>Delivery</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(public)/encartes/index" asChild>
            <TouchableOpacity className="flex-row items-center space-x-2">
              <FileText size={20} />
              <Text>Encartes</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
