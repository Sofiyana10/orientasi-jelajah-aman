// app/(tabs)/index.tsx
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native"; 
import { SafeAreaView } from "react-native-safe-area-context";

// Catatan: gunakan ../components/ jika file berada di dalam folder app/
// yang sejajar dengan folder components/
import WeatherCard from "../../components/WeatherCard";
import SearchBox from "../../components/SearchBox";
import RiwayatList from "../../components/RiwayatList";

export default function HalamanUtama() {
  const [kotaAktif, setKotaAktif] = useState("Pekalongan");
  const [riwayat, setRiwayat] = useState<string[]>(["Pekalongan"]);

  const { width } = useWindowDimensions(); 
  const isTablet = width > 768;

  // Tambahkan useEffect untuk mencatat perubahan kota aktif
  useEffect(() => {
    console.log("Kota aktif berubah menjadi:", kotaAktif);
  }, [kotaAktif]);

  function handleCari(kota: string) {
    setKotaAktif(kota);
    if (!riwayat.includes(kota)) {
      setRiwayat([...riwayat, kota]);
    }
  }

  return (
  <SafeAreaView style={{ flex: 1, padding: isTablet ? 32 : 16, gap: 16 }}>  <SearchBox onCari={handleCari} /> 
 <WeatherCard kota={kotaAktif} suhu={29} tingkatAQI="BAIK" /> 
 <RiwayatList daftarKota={riwayat} /> 
 </SafeAreaView> 
 );
}