// Path: src/features/company-page/view-models/product-details.view-model.ts

// Adicionando novas funcionalidades para adicionais
import { useState, useEffect, useCallback } from "react";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { CompanyProduct } from "../models/company-product";
import { Platform, Share } from "react-native";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { useToast } from "@gluestack-ui/themed";
import { toastUtils } from "@/src/utils/toast.utils";

// Interface para adicionais selecionados
interface SelectedAddon {
  product: CompanyProduct;
  quantity: number;
}

export interface ProductDetailsViewModel {
  // State existente...
  product: CompanyProduct | null;
  isLoading: boolean;
  quantity: number;
  observation: string;
  isFavorite: boolean;
  showObservationInput: boolean;
  isImageViewerVisible: boolean;

  // Novo estado para adicionais
  selectedAddons: SelectedAddon[];

  // Calculated properties
  hasVariation: boolean;
  maxQuantity: number;
  discountPercent: number | null;
  formattedTotal: string;
  primaryColor: string;

  // Actions existentes...
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
  toggleFavorite: () => void;
  toggleObservationInput: () => void;
  setObservation: (text: string) => void;
  addToCart: () => void;
  handleShareProduct: () => Promise<void>;
  handleOpenImageViewer: () => void;
  handleCloseImageViewer: () => void;

  // Novas ações para adicionais
  addAddonToCart: (addon: CompanyProduct, quantity: number) => void;
  getAddonQuantity: (addonId: string) => number;
  removeAddonFromCart: (addonId: string) => void;
}

export function useProductDetailsViewModel(
  productId: string
): ProductDetailsViewModel {
  const vm = useCompanyPageContext();
  const isCartEnabled = vm.config?.delivery?.habilitar_carrinho !== false;
  const cartVm = useCartViewModel();
  const toast = useToast();

  const [product, setProduct] = useState<CompanyProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(isCartEnabled ? 1 : 0);
  const [observation, setObservation] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showObservationInput, setShowObservationInput] = useState(false);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);

  // Novo estado para adicionais selecionados
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);

  // Buscar produto
  useEffect(() => {
    if (!productId || !vm.products) return;

    setIsLoading(true);

    // Simulando carregamento para melhor experiência
    setTimeout(() => {
      const foundProduct = vm.products.find((p) => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);

        // Iniciar com quantidade 1 se o carrinho estiver habilitado
        if (isCartEnabled) {
          setQuantity(1);
          setObservation("");
          setShowObservationInput(false);
        }
      }
      setIsLoading(false);
    }, 300);
  }, [productId, vm.products, isCartEnabled]);

  // Formatação de moeda
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  // Calcular desconto percentual
  const calculateDiscount = (): number | null => {
    if (!product || !product.preco_promocional) return null;

    const originalPrice = parseFloat(product.preco);
    const discountPrice = parseFloat(product.preco_promocional);
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  // Calcular preço total com base na quantidade e adicionais
  const calculateTotal = (): string => {
    if (!product) return formatCurrency("0");

    // Preço base do produto
    const basePrice = parseFloat(product.preco_promocional || product.preco);
    let totalPrice = basePrice * quantity;

    // Adicionar preço de adicionais
    selectedAddons.forEach((addon) => {
      const addonPrice = parseFloat(
        addon.product.preco_promocional || addon.product.preco
      );
      totalPrice += addonPrice * addon.quantity;
    });

    return formatCurrency(totalPrice.toString());
  };

  // Verificar se o produto tem variação
  const hasVariation = !!product?.tem_variacao;

  // Verificar limite máximo de quantidade
  const maxQuantity = product?.quantidade_maxima_carrinho || 999;

  // Actions
  const increaseQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity((prev) => prev + 1);
    } else {
      // Mostrar toast de limite atingido
      toastUtils.warning(
        toast,
        `Limite máximo de ${maxQuantity} unidades por pedido`
      );
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const toggleObservationInput = () => {
    setShowObservationInput((prev) => !prev);
  };

  // Adicionar produto ao carrinho com adicionais
  const addToCart = () => {
    if (!product || !vm.profile) return;

    const companySlug = vm.profile.empresa.slug;
    const companyName = vm.profile.nome;

    // Adiciona o item ao carrinho da empresa
    cartVm.addToCartWithObservation(
      product,
      companySlug,
      companyName,
      quantity,
      observation.trim()
    );

    // Adicionar os adicionais também
    selectedAddons.forEach((addon) => {
      if (addon.quantity > 0) {
        cartVm.addToCartWithObservation(
          addon.product,
          companySlug,
          companyName,
          addon.quantity,
          `Adicional para: ${product.nome}`
        );
      }
    });

    // Mostrar toast de sucesso
    toastUtils.success(toast, `${product.nome} adicionado ao carrinho!`);
  };

  // Adicionar ou atualizar adicional no carrinho
  const addAddonToCart = useCallback(
    (addon: CompanyProduct, quantity: number) => {
      setSelectedAddons((prev) => {
        // Verificar se o adicional já existe
        const existingIndex = prev.findIndex(
          (item) => item.product.id === addon.id
        );

        if (existingIndex >= 0) {
          // Se quantidade for 0, remover o item
          if (quantity === 0) {
            return prev.filter((item) => item.product.id !== addon.id);
          }

          // Atualizar quantidade
          const newAddons = [...prev];
          newAddons[existingIndex].quantity = quantity;
          return newAddons;
        } else if (quantity > 0) {
          // Adicionar novo item se quantidade > 0
          return [...prev, { product: addon, quantity }];
        }

        return prev;
      });
    },
    []
  );

  // Obter quantidade de um adicional específico
  const getAddonQuantity = useCallback(
    (addonId: string) => {
      const addon = selectedAddons.find((item) => item.product.id === addonId);
      return addon ? addon.quantity : 0;
    },
    [selectedAddons]
  );

  // Remover adicional do carrinho
  const removeAddonFromCart = useCallback((addonId: string) => {
    setSelectedAddons((prev) =>
      prev.filter((item) => item.product.id !== addonId)
    );
  }, []);

  // Compartilhar o produto
  const handleShareProduct = async () => {
    if (!product || !vm.profile) return;

    const productName = product.nome;
    const companyName = vm.profile.nome;

    let shareUrl = "";
    const shareMessage = `Confira ${productName} em ${companyName}`;

    if (Platform.OS === "web") {
      try {
        shareUrl = window.location.href;
      } catch (error) {
        console.log("Não foi possível obter URL para compartilhamento", error);
      }
    }

    try {
      await Share.share({
        message: shareUrl ? `${shareMessage}\n${shareUrl}` : shareMessage,
        title: `${productName} - ${companyName}`,
        url: shareUrl || undefined,
      });
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  const handleOpenImageViewer = () => {
    setIsImageViewerVisible(true);
  };

  const handleCloseImageViewer = () => {
    setIsImageViewerVisible(false);
  };

  return {
    // State
    product,
    isLoading,
    quantity,
    observation,
    isFavorite,
    showObservationInput,
    isImageViewerVisible,
    selectedAddons,

    // Calculated properties
    hasVariation,
    maxQuantity,
    discountPercent: calculateDiscount(),
    formattedTotal: calculateTotal(),
    primaryColor: vm.primaryColor || "#F4511E",

    // Actions
    increaseQuantity,
    decreaseQuantity,
    toggleFavorite,
    toggleObservationInput,
    setObservation,
    addToCart,
    handleShareProduct,
    handleOpenImageViewer,
    handleCloseImageViewer,
    addAddonToCart,
    getAddonQuantity,
    removeAddonFromCart,
  };
}
