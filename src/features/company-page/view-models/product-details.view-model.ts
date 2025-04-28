// Path: src/features/company-page/view-models/product-details.view-model.ts

import { useState, useEffect } from "react";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import { CompanyProduct } from "../models/company-product";
import { Platform, Share } from "react-native";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { useToast } from "@gluestack-ui/themed";
import { toastUtils } from "@/src/utils/toast.utils";

export interface ProductDetailsViewModel {
  // State
  product: CompanyProduct | null;
  isLoading: boolean;
  quantity: number;
  observation: string;
  isFavorite: boolean;
  showObservationInput: boolean;
  isImageViewerVisible: boolean;

  // Calculated properties
  hasVariation: boolean;
  maxQuantity: number;
  discountPercent: number | null;
  formattedTotal: string;
  primaryColor: string;

  // Actions
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
  toggleFavorite: () => void;
  toggleObservationInput: () => void;
  setObservation: (text: string) => void;
  addToCart: () => void;
  handleShareProduct: () => Promise<void>;
  handleOpenImageViewer: () => void;
  handleCloseImageViewer: () => void;
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

  // Buscar produto
  useEffect(() => {
    if (!productId || !vm.products) return;

    setIsLoading(true);

    // Path: src/features/company-page/view-models/product-details.view-model.ts (continuação)

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

  // Calcular preço total com base na quantidade
  const calculateTotal = (): string => {
    if (!product) return formatCurrency("0");

    const price = parseFloat(product.preco_promocional || product.preco);
    return formatCurrency((price * quantity).toString());
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

    // Mostrar toast de sucesso
    toastUtils.success(toast, `${product.nome} adicionado ao carrinho!`);
  };

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
  };
}
