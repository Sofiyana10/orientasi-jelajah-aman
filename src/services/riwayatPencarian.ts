import AsyncStorage from "@react-native-async-storage/async-storage";

const KUNCI_RIWAYAT = "@jelajah_aman:riwayat_pencarian";
const BATAS_RIWAYAT = 10;

export type KotaRiwayat = {
  id: number;
  nama: string;
  latitude: number;
  longitude: number;
  negara: string;
};

export async function ambilRiwayatPencarian(): Promise<KotaRiwayat[]> {
  try {
    const data = await AsyncStorage.getItem(KUNCI_RIWAYAT);
    if (!data) return [];

    const hasil: unknown = JSON.parse(data);
    return Array.isArray(hasil) ? (hasil as KotaRiwayat[]) : [];
  } catch {
    return [];
  }
}

export async function simpanRiwayatPencarian(kota: KotaRiwayat): Promise<void> {
  const daftarLama = await ambilRiwayatPencarian();

  const daftarBaru = [
    kota,
    ...daftarLama.filter(
      (item) =>
        item.id !== kota.id ||
        item.latitude !== kota.latitude ||
        item.longitude !== kota.longitude,
    ),
  ].slice(0, BATAS_RIWAYAT);

  await AsyncStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(daftarBaru));
}

export async function hapusRiwayatPencarian(
  id: number,
  latitude: number,
  longitude: number,
): Promise<void> {
  const daftar = await ambilRiwayatPencarian();

  const daftarBaru = daftar.filter(
    (item) =>
      item.id !== id ||
      item.latitude !== latitude ||
      item.longitude !== longitude,
  );

  await AsyncStorage.setItem(KUNCI_RIWAYAT, JSON.stringify(daftarBaru));
}
