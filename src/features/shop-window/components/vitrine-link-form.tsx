// Path: src/features/vitrine/components/vitrine-link-form.tsx
import React, { useEffect } from "react";
import { View } from "react-native";
import {
  Modal,
  FormControl,
  Input,
  Button,
  VStack,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectItem,
  ChevronDownIcon,
} from "@gluestack-ui/themed";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { VitrineLink } from "../models";


const formSchema = z.object({
  texto: z.string().min(1, "Texto é obrigatório"),
  url: z.string().url("URL inválida"),
  tipo_link: z.string().min(1, "Tipo de link é obrigatório"),
  ordem: z.number().optional(),
});

export type VitrineLinkFormData = z.infer<typeof formSchema>;

interface VitrineLinkFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VitrineLinkFormData) => void;
  isLoading: boolean;
  link?: VitrineLink;
}

const TIPOS_LINK = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "site", label: "Site" },
  { id: "outro", label: "Outro" },
];

export function VitrineLinkForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  link,
}: VitrineLinkFormProps) {
  const form = useForm<VitrineLinkFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      texto: "",
      url: "",
      tipo_link: "",
      ordem: 0,
    },
  });

  useEffect(() => {
    if (link) {
      form.reset({
        texto: link.texto,
        url: link.url,
        tipo_link: link.tipo_link,
        ordem: link.ordem,
      });
    } else {
      form.reset({
        texto: "",
        url: "",
        tipo_link: "",
        ordem: 0,
      });
    }
  }, [link, form]);

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content maxWidth={400}>
        <Modal.CloseButton />
        <Modal.Header>{link ? "Editar Link" : "Adicionar Link"}</Modal.Header>
        <Modal.Body>
          <VStack space="md">
            <Controller
              control={form.control}
              name="texto"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl isInvalid={!!error}>
                  <FormControl.Label>Texto do Link</FormControl.Label>
                  <Input>
                    <Input.Input
                      placeholder="Ex: Faça seu pedido"
                      onChangeText={onChange}
                      value={value}
                    />
                  </Input>
                  {error && (
                    <FormControl.Error>{error.message}</FormControl.Error>
                  )}
                </FormControl>
              )}
            />

            <Controller
              control={form.control}
              name="url"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl isInvalid={!!error}>
                  <FormControl.Label>URL</FormControl.Label>
                  <Input>
                    <Input.Input
                      placeholder="https://..."
                      onChangeText={onChange}
                      value={value}
                    />
                  </Input>
                  {error && (
                    <FormControl.Error>{error.message}</FormControl.Error>
                  )}
                </FormControl>
              )}
            />

            <Controller
              control={form.control}
              name="tipo_link"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl isInvalid={!!error}>
                  <FormControl.Label>Tipo de Link</FormControl.Label>
                  <Select selectedValue={value} onValueChange={onChange}>
                    <SelectTrigger>
                      <SelectInput placeholder="Selecione o tipo" />
                      <SelectIcon>
                        <ChevronDownIcon />
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicator />
                        {TIPOS_LINK.map((tipo) => (
                          <SelectItem
                            key={tipo.id}
                            label={tipo.label}
                            value={tipo.id}
                          />
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                  {error && (
                    <FormControl.Error>{error.message}</FormControl.Error>
                  )}
                </FormControl>
              )}
            />

            <Controller
              control={form.control}
              name="ordem"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl isInvalid={!!error}>
                  <FormControl.Label>Ordem de Exibição</FormControl.Label>
                  <Input>
                    <Input.Input
                      placeholder="0"
                      keyboardType="numeric"
                      onChangeText={(text) => onChange(Number(text))}
                      value={value?.toString()}
                    />
                  </Input>
                  {error && (
                    <FormControl.Error>{error.message}</FormControl.Error>
                  )}
                </FormControl>
              )}
            />
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space="md">
            <Button variant="outline" onPress={onClose} disabled={isLoading}>
              <Button.Text>Cancelar</Button.Text>
            </Button>
            <Button onPress={form.handleSubmit(onSubmit)} disabled={isLoading}>
              <Button.Text>{isLoading ? "Salvando..." : "Salvar"}</Button.Text>
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
