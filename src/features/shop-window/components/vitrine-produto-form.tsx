// Path: src/features/vitrine/components/vitrine-produto-form.tsx
import React, { useEffect } from "react";
import { View } from "react-native";
import {
  Modal,
  FormControl,
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
  Switch,
} from "@gluestack-ui/themed";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { useProducts } from "../../products/hooks/use-products";
import { Input } from "@/components/ui/input";
import { VitrineProduto } from "../models";

const formSchema = z.object({
  produto: z
    .string({
      required_error: "Produto é obrigatório",
    })
    .min(1, "Produto é obrigatório"),
  disponivel: z.boolean().default(true),
  ordem: z.string().optional(),
  sort: z.number().optional(),
});

export type VitrineProdutoFormData = z.infer<typeof formSchema>;

interface VitrineProdutoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: VitrineProdutoFormData) => void;
  isLoading: boolean;
  produto?: VitrineProduto;
}

export function VitrineProdutoForm({
  open,
  onClose,
  onSubmit,
  isLoading,
  produto,
}: VitrineProdutoFormProps) {
  const { products } = useProducts();

  const form = useForm<VitrineProdutoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      produto: "",
      disponivel: true,
      ordem: "",
      sort: 0,
    },
  });

  useEffect(() => {
    if (produto) {
      form.reset({
        produto: produto.produto.id,
        disponivel: produto.disponivel,
        ordem: produto.ordem || "",
        sort: produto.sort || 0,
      });
    } else {
      form.reset({
        produto: "",
        disponivel: true,
        ordem: "",
        sort: 0,
      });
    }
  }, [produto, form]);

  return (
    <Modal isOpen={open} onClose={onClose}>
      <Modal.Content maxWidth={400}>
        <Modal.CloseButton />
        <Modal.Header>
          {produto
            ? "Editar Produto na Vitrine"
            : "Adicionar Produto à Vitrine"}
        </Modal.Header>
        <Modal.Body>
          <VStack space="md">
            <Controller
              control={form.control}
              name="produto"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <FormControl isInvalid={!!error}>
                  <FormControl.Label>Produto</FormControl.Label>
                  <Select selectedValue={value} onValueChange={onChange}>
                    <SelectTrigger>
                      <SelectInput placeholder="Selecione um produto" />
                      <SelectIcon>
                        <ChevronDownIcon />
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicator />
                        {products.map((product) => (
                          <SelectItem
                            key={product.id}
                            label={product.nome}
                            value={product.id}
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
              name="disponivel"
              render={({ field: { onChange, value } }) => (
                <FormControl>
                  <View className="flex-row justify-between items-center">
                    <FormControl.Label>Disponível na Vitrine</FormControl.Label>
                    <Switch value={value} onValueChange={onChange} />
                  </View>
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
