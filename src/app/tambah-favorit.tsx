
import { View, Text, Button } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { tambahFavorit } from "../services/favoritStorage";
import { useTema } from "../contexts/themeContext";

export default function ModalTambahFavorit() {
  const { id, nama, lat, lon } = useLocalSearchParams<{
    id: string;
    nama: string;
    lat: string;
    lon: string;
  }>();

  const { warna } = useTema();

  async function simpan() {
    await tambahFavorit({
      id: Number(id),
      nama,
      latitude: Number(lat),
      longitude: Number(lon),
    });

    router.back();
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        gap: 16,
        backgroundColor: warna.background,
      }}
    >
      <Text
        style={{
          color: warna.text,
          fontSize: 16,
        }}
      >
        Tambahkan {nama} ke daftar favorit?
      </Text>

      <Button
        title="Simpan"
        onPress={simpan}
        color={warna.primary}
      />
    </View>
  );
}
