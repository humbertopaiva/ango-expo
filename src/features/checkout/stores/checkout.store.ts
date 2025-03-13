// Path: src/features/checkout/stores/checkout.store.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage } from "@/src/lib/storage";
import {
  CheckoutData,
  CheckoutDeliveryType,
  PersonalInfo,
  PaymentInfo,
  emptyCheckout,
} from "../models/checkout";
import { CartItem } from "@/src/features/cart/models/cart";

interface CheckoutState {
  // Estado
  checkout: CheckoutData;
  currentStep: number;

  // Ações
  initCheckout: (
    items: CartItem[],
    companyId: string,
    companySlug: string,
    companyName: string,
    subtotal: number,
    total: number
  ) => void;
  updateDeliveryType: (type: CheckoutDeliveryType) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updatePaymentInfo: (info: Partial<PaymentInfo>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      checkout: { ...emptyCheckout },
      currentStep: 0,

      initCheckout: (
        items,
        companyId,
        companySlug,
        companyName,
        subtotal,
        total
      ) => {
        set({
          checkout: {
            ...get().checkout,
            items,
            companyId,
            companySlug,
            companyName,
            subtotal,
            total,
          },
          currentStep: 0,
        });
      },

      updateDeliveryType: (type) => {
        set({
          checkout: {
            ...get().checkout,
            deliveryType: type,
          },
        });
      },

      updatePersonalInfo: (info) => {
        set({
          checkout: {
            ...get().checkout,
            personalInfo: {
              ...get().checkout.personalInfo,
              ...info,
            },
          },
        });
      },

      updatePaymentInfo: (info) => {
        set({
          checkout: {
            ...get().checkout,
            paymentInfo: {
              ...get().checkout.paymentInfo,
              ...info,
            },
          },
        });
      },

      nextStep: () => {
        const currentStep = get().currentStep;
        set({ currentStep: currentStep + 1 });
      },

      prevStep: () => {
        const currentStep = get().currentStep;
        if (currentStep > 0) {
          set({ currentStep: currentStep - 1 });
        }
      },

      goToStep: (step) => {
        set({ currentStep: step });
      },

      resetCheckout: () => {
        set({
          checkout: { ...emptyCheckout },
          currentStep: 0,
        });
      },
    }),
    {
      name: "checkout-storage",
      storage: createJSONStorage(() => ({
        getItem: async (name) => {
          const value = await storage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await storage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await storage.removeItem(name);
        },
      })),
    }
  )
);
