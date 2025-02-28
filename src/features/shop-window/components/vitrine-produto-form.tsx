// Path: src/features/shop-window/components/vitrine-produto-form.tsx
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
  Text,
} from "@gluestack-ui/themed";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { useProducts } from "../../products/hooks/use-products";
import { Input } from "@/components/ui/input";
import { VitrineProduto } from "../models";
import { THEME_COLORS } from "@/src/styles/colors";

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
      <Modal.Content maxWidth={400} bg="$white" borderRadius="$lg">
        <Modal.CloseButton />
        <Modal.Header>
          <Text fontSize="$lg" fontWeight="$bold" color="$gray800">
            {produto
              ? "Editar Produto na Vitrine"
              : "Adicionar Produto à Vitrine"}
          </Text>
        </Modal.Header>
        <Modal.Body>
          <VStack space="md">
            <FormControl isInvalid={!!form.formState.errors.produto}>
              <FormControl.Label>
                <Text className="text-gray-700 font-medium">Produto</Text>
              </FormControl.Label>
              <Controller
                control={form.control}
                name="produto"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <Select selectedValue={value} onValueChange={onChange}>
                    <SelectTrigger
                      borderColor={error ? "$red500" : "$gray200"}
                      borderWidth={1}
                      borderRadius="$md"
                      backgroundColor="$white"
                    >
                      <SelectInput placeholder="Selecione um produto" />
                      <SelectIcon>
                        <ChevronDownIcon color="$gray400" />
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
                )}
              />
              {form.formState.errors.produto && (
                <FormControl.Error>
                  <FormControl.Error.Text>
                    {form.formState.errors.produto.message}
                  </FormControl.Error.Text>
                </FormControl.Error>
              )}
            </FormControl>

            <Controller
              control={form.control}
              name="disponivel"
              render={({ field: { onChange, value } }) => (
                <FormControl>
                  <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <FormControl.Label margin="$0">
                      <Text className="text-gray-700 font-medium">
                        {value
                          ? "Disponível na Vitrine"
                          : "Indisponível na Vitrine"}
                      </Text>
                    </FormControl.Label>
                    <Switch
                      value={value}
                      onValueChange={onChange}
                      trackColor={{
                        true: THEME_COLORS.primary,
                        false: "$gray300",
                      }}
                    />
                  </View>
                  <Text className="text-xs text-gray-500 mt-1 ml-1">
                    {value
                      ? "O produto será exibido na vitrine para seus clientes"
                      : "O produto não será exibido na vitrine para seus clientes"}
                  </Text>
                </FormControl>
              )}
            />
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <View className="flex-row justify-end space-x-2 w-full">
            <Button
              variant="outline"
              onPress={onClose}
              disabled={isLoading}
              flex={1}
              borderColor="$gray300"
            >
              <Button.Text color="$gray700">Cancelar</Button.Text>
            </Button>
            <Button
              onPress={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              flex={1}
              backgroundColor={THEME_COLORS.primary}
            >
              <Button.Text>{isLoading ? "Salvando..." : "Salvar"}</Button.Text>
            </Button>
          </View>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
