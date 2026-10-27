
import { useState } from "react";
import { View, TextInput } from "react-native";
import { useTema } from "../contexts/themeContext";

interface SearchBoxProps {
  onCari: (teks: string) => void;
}

export default function SearchBox({ onCari }: SearchBoxProps) {
  const [teks, setTeks] = useState("");
  const { warna } = useTema();

  function handleChange(nilaiBaru: string) {
    setTeks(nilaiBaru);
    onCari(nilaiBaru);
  }

  return (
    <View>
      <TextInput
        placeholder="Cari nama kota..."
        placeholderTextColor={warna.secondaryText}
        value={teks}
        onChangeText={handleChange}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        style={{
          borderWidth: 1,
          borderColor: warna.border,
          padding: 12,
          borderRadius: 8,
          backgroundColor: warna.card,
          color: warna.text,
        }}
      />
    </View>
  );
}
