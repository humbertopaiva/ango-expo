// app/(drawer)/support.tsx
import React from "react";
import { View, Text, ScrollView } from "react-native";
import { AppBar } from "@/components/navigation/app-bar";
import { HelpCircle, Mail, Phone } from "lucide-react-native";

export default function SupportScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <AppBar />

      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View style={{ alignItems: "center", marginVertical: 24 }}>
          <HelpCircle size={64} color="#0891B2" />
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginTop: 16,
              color: "#111827",
            }}
          >
            Suporte
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#6B7280",
              textAlign: "center",
              marginTop: 8,
            }}
          >
            Estamos aqui para ajudar você com qualquer dúvida ou problema.
          </Text>
        </View>

        <View style={{ marginTop: 24 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              backgroundColor: "#E0F7FA",
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Phone size={24} color="#0891B2" />
            <View style={{ marginLeft: 16 }}>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: "#111827" }}
              >
                Contato por Telefone
              </Text>
              <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                +55 (11) 9999-9999
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 16,
              backgroundColor: "#E0F7FA",
              borderRadius: 8,
            }}
          >
            <Mail size={24} color="#0891B2" />
            <View style={{ marginLeft: 16 }}>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: "#111827" }}
              >
                Contato por Email
              </Text>
              <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                suporte@empresa.com.br
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 32 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#111827",
                marginBottom: 16,
              }}
            >
              Perguntas Frequentes
            </Text>

            <View style={{ marginBottom: 16 }}>
              <Text
                style={{ fontSize: 16, fontWeight: "500", color: "#111827" }}
              >
                Como posso cadastrar minha empresa?
              </Text>
              <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                Para cadastrar sua empresa, acesse a área de login e selecione a
                opção "Cadastrar empresa".
              </Text>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text
                style={{ fontSize: 16, fontWeight: "500", color: "#111827" }}
              >
                Como faço para editar informações?
              </Text>
              <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                Após fazer login, acesse a área "Gerenciar" e selecione as
                informações que deseja editar.
              </Text>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text
                style={{ fontSize: 16, fontWeight: "500", color: "#111827" }}
              >
                Esqueci minha senha, o que fazer?
              </Text>
              <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                Na tela de login, clique em "Esqueci minha senha" e siga as
                instruções para redefini-la.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
