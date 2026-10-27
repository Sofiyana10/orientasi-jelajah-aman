
import React from "react";
import { Text, View } from "react-native";
import { SumberData } from "../types/cache";
import { useTema } from "../contexts/themeContext";

interface StatusDataProps {
  sumber: SumberData;
  disimpanPada: number;
}

function formatUmur(disimpanPada: number): string {
  const menit = Math.floor((Date.now() - disimpanPada) / 60000);

  if (menit < 1) return "baru saja";
  if (menit < 60) return menit + " menit lalu";

  const jam = Math.floor(menit / 60);

  if (jam < 24) return jam + " jam lalu";

  return Math.floor(jam / 24) + " hari lalu";
}

function labelSumber(sumber: SumberData): string {
  if (sumber === "jaringan") return "Data terbaru dari internet";
  if (sumber === "cache-segar") return "Data tersimpan (masih segar)";

  return "Mode offline - data tersimpan mungkin sudah usang";
}

export default function StatusData({
  sumber,
  disimpanPada,
}: StatusDataProps) {
  const { warna, temaAktif } = useTema();

  const basi = sumber === "cache-basi";
  const label = labelSumber(sumber);
  const umur = formatUmur(disimpanPada);

  const warnaLatarStatus =
    temaAktif === "gelap"
      ? basi
        ? "#422F1D"
        : "#173B35"
      : basi
        ? "#FEF3E2"
        : "#EAFBF6";

  const warnaTeksStatus =
    temaAktif === "gelap"
      ? basi
        ? "#FBBF77"
        : "#6EE7B7"
      : basi
        ? "#B45309"
        : "#13795F";

  return (
    <View
      accessible
      accessibilityLabel={label + ", diperbarui " + umur}
      style={{
        padding: 8,
        borderRadius: 8,
        backgroundColor: warnaLatarStatus,
      }}
    >
      <Text style={{ fontSize: 12, color: warnaTeksStatus }}>
        {label}
      </Text>

      <Text style={{ fontSize: 11, color: warna.secondaryText }}>
        Diperbarui {umur}
      </Text>
    </View>
  );
}
