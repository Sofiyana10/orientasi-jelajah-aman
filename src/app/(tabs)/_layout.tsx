
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTema } from "../../contexts/themeContext";

export default function TabLayout() {
  const { warna } = useTema();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,

        headerStyle: {
          backgroundColor: warna.card,
        },
        headerTintColor: warna.text,
        headerTitleStyle: {
          color: warna.text,
        },

        tabBarStyle: {
          backgroundColor: warna.card,
          borderTopColor: warna.border,
        },
        tabBarActiveTintColor: warna.primary,
        tabBarInactiveTintColor: warna.secondaryText,

        sceneStyle: {
          backgroundColor: warna.background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={focused ? warna.primary : warna.secondaryText}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="riwayat"
        options={{
          title: "Riwayat",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="time-outline"
              size={size}
              color={focused ? warna.primary : warna.secondaryText}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="pengaturan"
        options={{
          title: "Pengaturan",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="settings-outline"
              size={size}
              color={focused ? warna.primary : warna.secondaryText}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="tentang"
        options={{
          title: "Tentang",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name="information-circle-outline"
              size={size}
              color={focused ? warna.primary : warna.secondaryText}
            />
          ),
        }}
      />
    </Tabs>
  );
}
