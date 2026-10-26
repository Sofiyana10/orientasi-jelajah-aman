// src/app/(tabs)/index.tsx
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import AtribusiCuaca from "../../components/AtribusiCuaca";
import SearchBox from "../../components/SearchBox";
import WeatherCard from "../../components/WeatherCard";

import { useDebounce } from "../../hooks/use-debounce";
import { ambilKualitasUdara } from "../../services/airQualityService";
import { ambilCacheUntukKota, cariKotaDiCache, simpanCacheCuaca } from "../../services/cuacaCache";
import { ambilSemuaFavorit } from "../../services/favoritStorage";
import { cariKota } from "../../services/geocodingService";
import {
  ambilKoordinatSaatIni,
  mintaIzinLokasi,
} from "../../services/locationService";
import { konversiTingkatAQI } from "../../services/weatherAdapter";
import { ambilCuaca } from "../../services/weatherService";
import type { KotaFavorit } from "../../types/favorit";

import { HasilGeocoding } from "../../types/geocoding";
import { DataCuacaLengkap, DataKualitasUdara } from "../../types/weather";

export default function HalamanUtama() {
  const [teksCari, setTeksCari] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null);
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);

  const [cuaca, setCuaca] = useState<DataCuacaLengkap | null>(null);
  const [kualitasUdara, setKualitasUdara] = useState<DataKualitasUdara | null>(
    null,
  );

  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);

  const teksTertunda = useDebounce(teksCari, 500);

  // Pencegah race condition
  const requestIdRef = useRef(0);

  useEffect(() => {
    let aktif = true;

    async function cariKotaLokalDanOnline() {
      const kata = teksTertunda.trim();

      if (!kata) {
        setHasilPencarian([]);
        return;
      }

      // Coba cari lewat internet terlebih dahulu
      try {
        const hasilOnline = await cariKota(kata);

        if (!aktif) return;

        if (hasilOnline.length > 0) {
          setHasilPencarian(hasilOnline);
          return;
        }
      } catch {
        // Jika internet gagal, lanjutkan ke cache lokal
      }

      // Cari kota yang pernah tersimpan di cache
      try {
        const hasilCache = await cariKotaDiCache(kata);

        if (!aktif) return;

        setHasilPencarian(
          hasilCache.map((item, index) => ({
            id: -(index + 1),
            name: item.namaKota,
            latitude: item.latitude,
            longitude: item.longitude,
            country: "",
          })),
        );
      } catch {
        if (aktif) setHasilPencarian([]);
      }
    }

    cariKotaLokalDanOnline();

    return () => {
      aktif = false;
    };
  }, [teksTertunda]);

  useFocusEffect(
    useCallback(() => {
      let aktif = true;

      ambilSemuaFavorit()
        .then((favorit) => {
          if (aktif) {
            setDaftarFavorit(favorit);
          }
        })
        .catch((err) => {
          console.error("Gagal mengambil daftar favorit:", err);
        });

      return () => {
        aktif = false;
      };
    }, []),
  );

  const sudahFavorit =
    kotaTerpilih !== null &&
    daftarFavorit.some((favorit) => favorit.id === kotaTerpilih.id);

  async function pilihKota(kota: HasilGeocoding) {
    setKotaTerpilih(kota);

    const idSaatIni = ++requestIdRef.current;

    setSedangMemuat(true);
    setPesanError(null);

    try {
      const [dataCuaca, dataAQI] = await Promise.all([
        ambilCuaca(kota.latitude, kota.longitude),
        ambilKualitasUdara(kota.latitude, kota.longitude),
      ]);

      // Jika ada request yang lebih baru, abaikan hasil lama
      if (idSaatIni !== requestIdRef.current) return;

      // Tampilkan data cuaca di halaman
      setCuaca(dataCuaca);
      setKualitasUdara(dataAQI);

      // Simpan data cuaca ke cache secara otomatis
      try {
        await simpanCacheCuaca({
          namaKota: kota.name,
          latitude: kota.latitude,
          longitude: kota.longitude,
          cuaca: dataCuaca,
          kualitasUdara: dataAQI,
          waktuSimpan: Date.now(),
        });

        console.log("Data cuaca berhasil disimpan ke cache");
      } catch (error) {
        console.warn("Gagal menyimpan cache cuaca:", error);
      }
    } catch {
      if (idSaatIni !== requestIdRef.current) return;

      // Jika internet gagal, ambil cuaca terakhir dari cache
      try {
        const cache = await ambilCacheUntukKota(kota.name);

        if (idSaatIni !== requestIdRef.current) return;

        if (cache) {
          setCuaca(cache.cuaca);
          setKualitasUdara(cache.kualitasUdara);
          setPesanError(null);

          console.log(`Menampilkan cache cuaca untuk ${cache.namaKota}`);
        } else {
          setCuaca(null);
          setKualitasUdara(null);
          setPesanError(
            `Data cuaca ${kota.name} belum tersimpan. Hubungkan internet untuk memuatnya.`,
          );
        }
      } catch {
        if (idSaatIni !== requestIdRef.current) return;

        setPesanError("Gagal membaca cache cuaca.");
      }
    } finally {
      if (idSaatIni === requestIdRef.current) {
        setSedangMemuat(false);
      }
    }
  }

  async function gunakanLokasiSaatIni() {
    const status = await mintaIzinLokasi();
    if (status === "denied") {
      setPesanLokasi(
        "Izin lokasi ditolak. Silakan cari kota secara manual di atas.",
      );
      return;
    }
    if (status === "unavailable") {
      setPesanLokasi(
        "Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual.",
      );
      return;
    }
    setPesanLokasi(null);
    const koordinat = await ambilKoordinatSaatIni();
    pilihKota({
      id: -1,
      name: "Lokasi Saat Ini",
      latitude: koordinat.latitude,
      longitude: koordinat.longitude,
      country: "",
    });
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 16,
        gap: 16,
      }}
    >
      <SearchBox onCari={setTeksCari} />

      <Button title="Gunakan Lokasi Saat Ini" onPress={gunakanLokasiSaatIni} />
      {pesanLokasi && <Text>{pesanLokasi}</Text>}

      {hasilPencarian.map((kota) => (
        <TouchableOpacity
          key={kota.id}
          onPress={() => pilihKota(kota)}
          accessibilityRole="button"
          accessibilityLabel={`Pilih kota ${kota.name}`}
        >
          <Text>{kota.name}</Text>
        </TouchableOpacity>
      ))}

      {sedangMemuat && <ActivityIndicator />}

      {pesanError && (
        <View>
          <Text>{pesanError}</Text>

          <Button
            title="Coba Lagi"
            onPress={() => {
              if (kotaTerpilih) {
                pilihKota(kotaTerpilih);
              }
            }}
          />
        </View>
      )}

      {cuaca && kualitasUdara && kotaTerpilih && !sedangMemuat && (
        <>
          <WeatherCard
            kota={kotaTerpilih.name}
            suhu={cuaca.saatIni.suhu}
            tingkatAQI={konversiTingkatAQI(kualitasUdara.indeksAQI)}
            indeksAQI={kualitasUdara.indeksAQI}
          />

          <Button
            title={sudahFavorit ? "Sudah di Favorit" : "Tambahkan ke Favorit"}
            disabled={sudahFavorit}
            onPress={() =>
              router.push({
                pathname: "/tambah-favorit",
                params: {
                  id: String(kotaTerpilih.id),
                  nama: kotaTerpilih.name,
                  lat: String(kotaTerpilih.latitude),
                  lon: String(kotaTerpilih.longitude),
                },
              })
            }
          />

          <Text>Suhu maksimal hari ini: {cuaca.harian.suhuMaksimal[0]}°C</Text>

          <Text>Suhu minimal hari ini: {cuaca.harian.suhuMinimal[0]}°C</Text>
        </>
      )}

      {cuaca && (
        <Text style={{ fontSize: 12, color: "#888" }}>
          PM2.5: {kualitasUdara?.pm25 ?? "-"} µg/m³ • PM10:{" "}
          {kualitasUdara?.pm10 ?? "-"} µg/m³
        </Text>
      )}

      <AtribusiCuaca />
    </SafeAreaView>
  );
}
