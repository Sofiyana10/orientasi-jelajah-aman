
import { View, Button } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import WeatherCard from "../../components/WeatherCard";
import { useTema } from "../../contexts/themeContext";

export default function HalamanDetail() {
  const { kota } = useLocalSearchParams<{ kota: string }>();
  const { warna } = useTema();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: warna.background,
      }}
    >
      <View
        style={{
          flex: 1,
          padding: 16,
          gap: 16,
          backgroundColor: warna.background,
        }}
      >
        <WeatherCard
          kota={kota}
          suhu={29}
          tingkatAQI="BAIK"
        />

        <Button
          title="Tambahkan ke Favorit"
          onPress={() => router.push("/tambah-favorit")}
          color={warna.primary}
        />
      </View>
    </SafeAreaView>
  );
}
