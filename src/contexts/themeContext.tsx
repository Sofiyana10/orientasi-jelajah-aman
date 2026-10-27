import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export type PilihanTema = "terang" | "gelap" | "sistem";

type WarnaTema = {
  background: string;
  card: string;
  text: string;
  secondaryText: string;
  border: string;
  primary: string;
};

type TemaContextType = {
  pilihanTema: PilihanTema;
  temaAktif: "terang" | "gelap";
  warna: WarnaTema;
  ubahTema: (tema: PilihanTema) => Promise<void>;
};

const KUNCI_TEMA = "@jelajah_aman:pilihan_tema";

const warnaTerang: WarnaTema = {
  background: "#F5F7FB",
  card: "#FFFFFF",
  text: "#1E293B",
  secondaryText: "#64748B",
  border: "#E2E8F0",
  primary: "#2563EB",
};

const warnaGelap: WarnaTema = {
  background: "#0F172A",
  card: "#1E293B",
  text: "#F8FAFC",
  secondaryText: "#CBD5E1",
  border: "#334155",
  primary: "#60A5FA",
};

type TemaContextValue = TemaContextType | null;

const TemaContext = createContext<TemaContextValue>(null);

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const skemaPerangkat = useColorScheme();
  const [pilihanTema, setPilihanTema] = useState<PilihanTema>("sistem");
  const [selesaiMemuat, setSelesaiMemuat] = useState(false);

  useEffect(() => {
    async function muatTema() {
      try {
        const tersimpan = await AsyncStorage.getItem(KUNCI_TEMA);

        if (
          tersimpan === "terang" ||
          tersimpan === "gelap" ||
          tersimpan === "sistem"
        ) {
          setPilihanTema(tersimpan);
        }
      } catch (error) {
        console.error("Gagal memuat pilihan tema:", error);
      } finally {
        setSelesaiMemuat(true);
      }
    }

    void muatTema();
  }, []);

  async function ubahTema(tema: PilihanTema) {
    setPilihanTema(tema);

    try {
      await AsyncStorage.setItem(KUNCI_TEMA, tema);
    } catch (error) {
      console.error("Gagal menyimpan pilihan tema:", error);
    }
  }

  const temaAktif =
    pilihanTema === "sistem"
      ? skemaPerangkat === "dark"
        ? "gelap"
        : "terang"
      : pilihanTema;

  const warna = temaAktif === "gelap" ? warnaGelap : warnaTerang;

  if (!selesaiMemuat) {
    return null;
  }

  return (
    <TemaContext.Provider value={{ pilihanTema, temaAktif, warna, ubahTema }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  const context = useContext(TemaContext);

  if (!context) {
    throw new Error("useTema harus digunakan di dalam TemaProvider.");
  }

  return context;
}
