// src/features/delivery-config/schemas/delivery-config.schema.ts
import * as z from "zod";

export const deliveryConfigSchema = z.object({
  tempo_estimado_entrega: z.coerce.number().min(1, "Tempo mínimo de 1 minuto"),
  especificar_bairros_atendidos: z.boolean().default(false),
  bairros_atendidos: z.array(z.string()).default([]),
  observacoes: z.string().default(""),
  taxa_entrega: z.string().min(1, "Taxa de entrega é obrigatória"),
  pedido_minimo: z.string().min(1, "Pedido mínimo é obrigatório"),
});

export type DeliveryConfigFormData = z.infer<typeof deliveryConfigSchema>;
