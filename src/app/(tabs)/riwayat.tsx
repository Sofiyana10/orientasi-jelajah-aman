import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ambilRiwayatPencarian,
  hapusRiwayatPencarian,
} from "../../services/riwayatPencarian";

import { useTema } from "../../contexts/themeContext";
import type { KotaRiwayat } from "../../services/riwayatPencarian";

export default function TabRiwayat() {
  const [daftarRiwayat, setDaftarRiwayat] = useState<KotaRiwayat[]>([]);
  const { warna } = useTema();

  const muatRiwayat = useCallback(async () => {
    const data = await ambilRiwayatPencarian();
    setDaftarRiwayat(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void muatRiwayat();
    }, [muatRiwayat]),
  );

  function bukaKota(kota: KotaRiwayat) {
    router.push({
      pathname: "/(tabs)",
      params: {
        kotaId: String(kota.id),
        nama: kota.nama,
        latitude: String(kota.latitude),
        longitude: String(kota.longitude),
        negara: kota.negara,
      },
    });
  }

  function konfirmasiHapus(kota: KotaRiwayat) {
    const hapus = async () => {
      try {
        await hapusRiwayatPencarian(kota.id, kota.latitude, kota.longitude);
        await muatRiwayat();
      } catch (error) {
        console.error("Gagal menghapus riwayat:", error);
        Alert.alert("Gagal", "Riwayat belum berhasil dihapus.");
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm(`Yakin hapus riwayat ${kota.nama}?`)) {
        void hapus();
      }
      return;
    }

    Alert.alert(
      "Konfirmasi Hapus",
      `Yakin ingin menghapus ${kota.nama} dari riwayat pencarian?`,
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => void hapus(),
        },
      ],
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: warna.background,
      }}
    >
      <ScrollView
        style={{ backgroundColor: warna.background }}
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: warna.text,
          }}
        >
          Riwayat Pencarian
        </Text>

        <Text
          style={{
            color: warna.secondaryText,
            marginTop: 6,
            marginBottom: 20,
          }}
        >
          {daftarRiwayat.length} dari 10 pencarian terakhir
        </Text>

        {daftarRiwayat.length === 0 ? (
          <View
            style={{
              backgroundColor: warna.card,
              borderRadius: 12,
              padding: 20,
              alignItems: "center",
              borderWidth: 1,
              borderColor: warna.border,
            }}
          >
            <Text style={{ color: warna.secondaryText }}>
              Belum ada riwayat pencarian kota.
            </Text>
          </View>
        ) : (
          daftarRiwayat.map((kota) => (
            <View
              key={`${kota.id}-${kota.latitude}-${kota.longitude}`}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: warna.card,
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: warna.border,
              }}
            >
              <TouchableOpacity
                style={{ flex: 1, paddingVertical: 4 }}
                onPress={() => bukaKota(kota)}
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: warna.text,
                  }}
                >
                  {kota.nama}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => konfirmasiHapus(kota)}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: "#fee2e2",
                }}
              >
                <Text
                  style={{
                    color: "#b91c1c",
                    fontWeight: "600",
                    fontSize: 13,
                  }}
                >
                  Hapus
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
