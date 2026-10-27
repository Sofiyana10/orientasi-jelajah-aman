
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { typeScale, spacing } from "../../constants/styles";
import { useTema } from "../../contexts/themeContext";

export default function Tentang() {
  const { warna } = useTema();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: warna.background,
      }}
    >
      <View
        style={{
          padding: spacing.sedang,
          margin: spacing.sedang,
          borderRadius: 12,
          backgroundColor: warna.card,
          borderWidth: 1,
          borderColor: warna.border,
        }}
      >
        <Text
          accessibilityLabel="Tentang aplikasi Jelajah Aman"
          style={{
            fontSize: typeScale.judul,
            fontWeight: "bold",
            marginBottom: spacing.sedang,
            color: warna.text,
          }}
        >
          Jelajah Aman
        </Text>

        <Text
          style={{
            fontSize: typeScale.subjudul,
            marginBottom: spacing.kecil,
            color: warna.secondaryText,
          }}
        >
          Versi 1.0.0
        </Text>

        <Text
          style={{
            fontSize: typeScale.isi,
            color: warna.text,
          }}
        >
          Dibuat oleh Riskha Syofiyana
        </Text>
      </View>
    </SafeAreaView>
  );
}
