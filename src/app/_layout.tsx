
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TemaProvider, useTema } from "../contexts/themeContext";

function NavigasiUtama() {
  const { temaAktif, warna } = useTema();

  return (
    <>
      <StatusBar style={temaAktif === "gelap" ? "light" : "dark"} />

      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: warna.background,
          },
          headerStyle: {
            backgroundColor: warna.card,
          },
          headerTintColor: warna.text,
          headerTitleStyle: {
            color: warna.text,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="detail/[kota]"
          options={{ title: "Detail Cuaca" }}
        />

        <Stack.Screen
          name="tambah-favorit"
          options={{ presentation: "modal", title: "Tambah Favorit" }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <TemaProvider>
      <NavigasiUtama />
    </TemaProvider>
  );
}