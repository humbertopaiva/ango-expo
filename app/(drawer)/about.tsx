// app/(drawer)/about.tsx
import React from "react";
import { View, Text, ScrollView, Image } from "react-native";
import { AppBar } from "@/components/navigation/app-bar";

export default function AboutScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <AppBar />

      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View style={{ alignItems: "center", marginVertical: 24 }}>
          <Image
            source={require("@/assets/images/logo-white.png")}
            style={{ height: 100, width: 200, resizeMode: "contain" }}
          />
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginTop: 16,
              color: "#111827",
            }}
          >
            Quem Somos
          </Text>
        </View>

        <Text
          style={{
            fontSize: 16,
            color: "#374151",
            lineHeight: 24,
            marginBottom: 16,
          }}
        >
          Somos uma empresa dedicada a conectar comércios locais com seus
          clientes, facilitando a descoberta de novos estabelecimentos e
          produtos em sua região.
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#374151",
            lineHeight: 24,
            marginBottom: 16,
          }}
        >
          Nossa missão é fortalecer o comércio local, dando visibilidade a
          pequenos e médios negócios e oferecendo uma plataforma para que possam
          mostrar seus produtos e serviços para a comunidade.
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#111827",
            marginTop: 24,
            marginBottom: 16,
          }}
        >
          Nossa História
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#374151",
            lineHeight: 24,
            marginBottom: 16,
          }}
        >
          Fundada em 2023, nossa empresa nasceu da percepção de que muitos
          negócios locais tinham dificuldade em se destacar em meio às grandes
          redes. Começamos com uma pequena equipe apaixonada por tecnologia e
          pelo desenvolvimento local.
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#374151",
            lineHeight: 24,
            marginBottom: 16,
          }}
        >
          Hoje, estamos presentes em diversas cidades, ajudando a conectar
          milhares de comerciantes e consumidores, fortalecendo economias locais
          e construindo comunidades mais prósperas.
        </Text>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#111827",
            marginTop: 24,
            marginBottom: 16,
          }}
        >
          Nossos Valores
        </Text>

        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "#111827" }}>
            Comunidade
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
            Acreditamos no poder das comunidades locais e no impacto positivo
            que negócios próximos geram para a qualidade de vida.
          </Text>
        </View>

        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "#111827" }}>
            Inovação
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
            Buscamos constantemente novas maneiras de aprimorar nossa plataforma
            e oferecer soluções inovadoras para comerciantes e consumidores.
          </Text>
        </View>

        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "#111827" }}>
            Transparência
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
            Mantemos uma comunicação clara e honesta com todos os nossos
            parceiros e usuários.
          </Text>
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 16, fontWeight: "500", color: "#111827" }}>
            Impacto Social
          </Text>
          <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
            Trabalhamos para gerar impacto positivo nas comunidades em que
            atuamos, apoiando iniciativas locais e práticas sustentáveis.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
