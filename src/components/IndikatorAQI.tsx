import { Text } from "react-native";
import { LaporanUdara } from "../types/cuaca";

interface IndikatorAQIProps {
  laporan: LaporanUdara;
}

export default function IndikatorAQI({ laporan }: IndikatorAQIProps) {
  const warna =
    laporan.tingkat === "BAIK" ? "green"
      : laporan.tingkat === "SEDANG" ? "orange"
      : laporan.tingkat === "TIDAK_SEHAT" ? "red" : "purple";

  return (
    <Text style={{ color: warna }}>
      Kualitas Udara: {laporan.tingkat} (AQI: {laporan.indeksAQI})
    </Text>
  );
}