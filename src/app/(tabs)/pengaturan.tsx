
import React, { useState } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { hapusSemuaCache } from "../../services/cacheRepository";
import { useTema, PilihanTema } from "../../contexts/themeContext";

export default function TabPengaturan() {
  const [pesan, setPesan] = useState<string | null>(null);
  const { pilihanTema, temaAktif, warna, ubahTema } = useTema();

  async function hapusDataTersimpan() {
    await hapusSemuaCache();
    setPesan("Data cuaca tersimpan sudah dihapus.");
  }

  const daftarTema: { label: string; nilai: PilihanTema }[] = [
    { label: "Terang", nilai: "terang" },
    { label: "Gelap", nilai: "gelap" },
    { label: "Ikuti Sistem", nilai: "sistem" },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        gap: 16,
        backgroundColor: warna.background,
      }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold", color: warna.text }}>
        Pengaturan
      </Text>

      <View
        style={{
          padding: 16,
          gap: 12,
          borderRadius: 12,
          backgroundColor: warna.card,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: warna.text }}>
          Tampilan
        </Text>

        <Text style={{ color: warna.secondaryText }}>
          Pilih tema yang ingin digunakan.
        </Text>

        {daftarTema.map((item) => {
          const dipilih = pilihanTema === item.nilai;

          return (
            <TouchableOpacity
              key={item.nilai}
              onPress={() => ubahTema(item.nilai)}
              accessibilityRole="radio"
              accessibilityState={{ checked: dipilih }}
              style={{
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: dipilih ? warna.primary : warna.border,
                backgroundColor: dipilih ? warna.primary : warna.card,
              }}
            >
              <Text
                style={{
                  color: dipilih ? "#FFFFFF" : warna.text,
                  fontWeight: dipilih ? "bold" : "normal",
                }}
              >
                {dipilih ? "✓ " : ""}
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        <Text style={{ color: warna.secondaryText }}>
          Tema aktif: {temaAktif === "gelap" ? "Gelap" : "Terang"}
        </Text>
      </View>

      <View
        style={{
          padding: 16,
          gap: 12,
          borderRadius: 12,
          backgroundColor: warna.card,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: warna.text }}>
          Tentang Aplikasi
        </Text>

        <Text style={{ color: warna.text }}>Jelajah Aman</Text>
        <Text style={{ color: warna.secondaryText }}>Versi 1.0.0</Text>

        <Button
          title="Hapus Data Cuaca Tersimpan"
          onPress={hapusDataTersimpan}
        />

        {pesan && (
          <Text style={{ color: warna.text }} accessibilityLabel={pesan}>
            {pesan}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}