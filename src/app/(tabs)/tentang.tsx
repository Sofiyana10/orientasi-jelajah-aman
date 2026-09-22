import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View } from "react-native";
import { typeScale, spacing } from "../../constants/styles";

export default function Tentang() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ padding: spacing.sedang }}>
        <Text
          accessibilityLabel="Tentang aplikasi Jelajah Aman"
          style={{
            fontSize: typeScale.judul,
            fontWeight: "bold",
            marginBottom: spacing.sedang,
          }}
        >
          Jelajah Aman
        </Text>

        <Text
          style={{
            fontSize: typeScale.subjudul,
            marginBottom: spacing.kecil,
          }}
        >
          Versi 1.0.0
        </Text>

        <Text style={{ fontSize: typeScale.isi }}>
          Dibuat oleh Riskha Syofiyana
        </Text>
      </View>
    </SafeAreaView>
  );
}