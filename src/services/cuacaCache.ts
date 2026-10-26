// src/services/cuacaCache.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DataCuacaLengkap, DataKualitasUdara } from "../types/weather";

const KUNCI_CACHE_CUACA = "@jelajah_aman:cache_cuaca";

export type CacheCuaca = {
  namaKota: string;
  latitude: number;
  longitude: number;
  cuaca: DataCuacaLengkap;
  kualitasUdara: DataKualitasUdara;
  waktuSimpan: number;
};

// Ambil semua kota yang tersimpan
export async function ambilSemuaCacheCuaca(): Promise<CacheCuaca[]> {
  const json = await AsyncStorage.getItem(KUNCI_CACHE_CUACA);

  if (!json) return [];

  try {
    const data = JSON.parse(json);

    // Format baru: daftar beberapa kota
    if (Array.isArray(data)) {
      return data as CacheCuaca[];
    }

    // Format lama: hanya satu kota
    if (data && typeof data.namaKota === "string") {
      const daftarLama = [data as CacheCuaca];

      await AsyncStorage.setItem(KUNCI_CACHE_CUACA, JSON.stringify(daftarLama));

      return daftarLama;
    }

    return [];
  } catch {
    await AsyncStorage.removeItem(KUNCI_CACHE_CUACA);
    return [];
  }
}

// Simpan atau perbarui cache suatu kota
export async function simpanCacheCuaca(data: CacheCuaca): Promise<void> {
  const daftar = await ambilSemuaCacheCuaca();

  const daftarBaru = daftar.filter(
    (item) => item.namaKota.toLowerCase() !== data.namaKota.toLowerCase(),
  );

  daftarBaru.unshift(data);

  await AsyncStorage.setItem(KUNCI_CACHE_CUACA, JSON.stringify(daftarBaru));
}

// Cari kota yang pernah tersimpan
export async function cariKotaDiCache(
  kataKunci: string,
): Promise<CacheCuaca[]> {
  const daftar = await ambilSemuaCacheCuaca();
  const kata = kataKunci.trim().toLowerCase();

  if (!kata) return [];

  return daftar.filter((item) => item.namaKota.toLowerCase().includes(kata));
}

// Ambil cache berdasarkan nama kota
export async function ambilCacheUntukKota(
  namaKota: string,
): Promise<CacheCuaca | null> {
  const daftar = await ambilSemuaCacheCuaca();

  return (
    daftar.find(
      (item) => item.namaKota.toLowerCase() === namaKota.toLowerCase(),
    ) ?? null
  );
}
