// Path: src/features/company-page/view-models/product-variation.view-model.ts
import { useState, useEffect, useCallback } from "react";
import { useCompanyPageContext } from "../contexts/use-company-page-context";
import {
  CompanyProduct,
  ProductWithVariation,
} from "../models/company-product";
import { Platform, Share } from "react-native";
import { useCartViewModel } from "@/src/features/cart/view-models/use-cart-view-model";
import { useToast } from "@gluestack-ui/themed";
import { toastUtils } from "@/src/utils/toast.utils";
import { api } from "@/src/services/api";
import { router } from "expo-router";

interface VariationOption {
  id: string;
  name: string;
  price: string;
  promotional_price: string | null;
  description: string | null;
  image: string | null;
  available: boolean;
}

// Interface para adicionais selecionados
interface SelectedAddon {
  product: CompanyProduct;
  quantity: number;
}

export interface ProductVariationViewModel {
  // State
  product: CompanyProduct | null;
  isLoading: boolean;
  quantity: number;
  observation: string;
  showObservationInput: boolean;
  isImageViewerVisible: boolean;
  variationOptions: VariationOption[];
  selectedVariation: VariationOption | null;
  loadingVariations: boolean;
  variationError: string | null;
  selectedAddons: SelectedAddon[]; // Nova propriedade para adicionais selecionados
  isConfirmationVisible: boolean;
  lastAddedItem: any;

  // Calculated properties
  maxQuantity: number;
  discountPercent: number | null;
  formattedTotal: string;
  primaryColor: string;
  currentImage: string | null;

  // Actions
  increaseQuantity: () => void;
  decreaseQuantity: () => void;
  toggleObservationInput: () => void;
  setObservation: (text: string) => void;
  selectVariation: (option: VariationOption) => void;
  addToCart: () => void;
  handleShareProduct: () => Promise<void>;
  handleOpenImageViewer: () => void;
  handleCloseImageViewer: () => void;
  showConfirmation: () => void;
  hideConfirmation: () => void;

  // Novas ações para adicionais
  addAddonToCart: (addon: CompanyProduct, quantity: number) => void;
  getAddonQuantity: (addonId: string) => number;
  removeAddonFromCart: (addonId: string) => void;
  resetState: () => void;
}

export function useProductVariationViewModel(
  productId: string
): ProductVariationViewModel {
  const vm = useCompanyPageContext();
  const isCartEnabled = vm.config?.delivery?.habilitar_carrinho !== false;
  const cartVm = useCartViewModel();
  const toast = useToast();

  const [product, setProduct] = useState<CompanyProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(isCartEnabled ? 1 : 0);
  const [observation, setObservation] = useState("");
  const [showObservationInput, setShowObservationInput] = useState(false);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);

  // Variation specific state
  const [variationOptions, setVariationOptions] = useState<VariationOption[]>(
    []
  );
  const [selectedVariation, setSelectedVariation] =
    useState<VariationOption | null>(null);
  const [loadingVariations, setLoadingVariations] = useState(false);
  const [variationError, setVariationError] = useState<string | null>(null);

  // Estado para adicionais selecionados
  const [selectedAddons, setSelectedAddons] = useState<SelectedAddon[]>([]);

  // Estado para o modal de confirmação
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<any>(null);

  // Fetch product
  useEffect(() => {
    if (!productId || !vm.products) return;

    setIsLoading(true);

    setTimeout(() => {
      const foundProduct = vm.products.find((p) => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);

        // Initialize with quantity 1 if cart is enabled
        if (isCartEnabled) {
          setQuantity(1);
          setObservation("");
          setShowObservationInput(false);
        }

        // If product has variations, fetch them
        if (foundProduct.tem_variacao) {
          fetchVariationOptions(foundProduct.id);
        }
      }
      setIsLoading(false);
    }, 300);
  }, [productId, vm.products, isCartEnabled]);

  // Fetch variation options - CORRECTED ENDPOINT
  const fetchVariationOptions = async (productId: string) => {
    if (!productId) return;

    setLoadingVariations(true);
    setVariationError(null);

    try {
      // Using the correct API endpoint for variations
      const response = await api.get(`/api/products/${productId}/variations`);

      if (response.data?.data) {
        const variations = Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];

        const options: VariationOption[] = variations.map((item: any) => ({
          id: item.id,
          name: item.valor_variacao || "Opção",
          price: item.preco || "0",
          promotional_price: item.preco_promocional || null,
          description: item.descricao || null,
          image: item.imagem || null,
          available: item.disponivel !== false,
        }));

        const availableOptions = options.filter((option) => option.available);
        setVariationOptions(availableOptions);

        // Select the first available option by default
        const firstAvailable = availableOptions[0];
        if (firstAvailable) {
          setSelectedVariation(firstAvailable);
        }
      }
    } catch (error) {
      console.error("Error fetching variation options:", error);
      setVariationError("Não foi possível carregar as opções deste produto");
    } finally {
      setLoadingVariations(false);
    }
  };

  // Currency formatting
  const formatCurrency = (value: string | number) => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericValue);
  };

  // Calculate percentage discount
  const calculateDiscount = (): number | null => {
    if (!selectedVariation) {
      if (!product || !product.preco_promocional) return null;
      const originalPrice = parseFloat(product.preco);
      const discountPrice = parseFloat(product.preco_promocional);
      return Math.round(
        ((originalPrice - discountPrice) / originalPrice) * 100
      );
    }

    if (!selectedVariation.promotional_price) return null;
    const originalPrice = parseFloat(selectedVariation.price);
    const discountPrice = parseFloat(selectedVariation.promotional_price);
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  // Calculate total price based on quantity, selected variation, and adicionais
  const calculateTotal = (): string => {
    if (!selectedVariation && !product) return formatCurrency(0);

    let price = 0;
    if (selectedVariation) {
      price = parseFloat(
        selectedVariation.promotional_price || selectedVariation.price
      );
    } else if (product) {
      price = parseFloat(product.preco_promocional || product.preco);
    }

    // Base price of the product * quantity
    let totalPrice = price * quantity;

    // Add price of addons
    selectedAddons.forEach((addon) => {
      const addonPrice = parseFloat(
        addon.product.preco_promocional || addon.product.preco
      );
      totalPrice += addonPrice * addon.quantity;
    });

    return formatCurrency(totalPrice);
  };

  // Get the current image to display
  const getCurrentImage = (): string | null => {
    // If a variation is selected and has an image, use it
    if (selectedVariation && selectedVariation.image) {
      return selectedVariation.image;
    }

    // Otherwise, fallback to the main product image
    return product?.imagem || null;
  };

  // Check maximum quantity limit
  const maxQuantity = product?.quantidade_maxima_carrinho || 999;

  // Funções para o modal de confirmação
  const showConfirmation = useCallback(() => {
    setIsConfirmationVisible(true);
  }, []);

  const resetState = useCallback(() => {
    setQuantity(1);
    setObservation("");
    setShowObservationInput(false);
    setSelectedAddons([]);
  }, []);

  const hideConfirmation = useCallback(() => {
    setIsConfirmationVisible(false);

    // Resetar o estado
    resetState();

    // Retornar para a página da empresa
    if (product && product.empresa && product.empresa.slug) {
      router.replace(`/(drawer)/empresa/${product.empresa.slug}`);
    } else {
      router.back();
    }
  }, [product, resetState]);

  // Actions
  const increaseQuantity = () => {
    if (quantity < maxQuantity) {
      setQuantity((prev) => prev + 1);
    } else {
      // Show toast for maximum limit reached
      toastUtils.warning(
        toast,
        `Limite máximo de ${maxQuantity} unidades por pedido`
      );
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const toggleObservationInput = () => {
    setShowObservationInput((prev) => !prev);
  };

  const selectVariation = (option: VariationOption) => {
    setSelectedVariation(option);
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

  const addToCart = useCallback(() => {
    if (!product || !vm.profile || !selectedVariation) return;

    // Gerar timestamp único para este item
    const timestamp = Date.now();
    const uniqueItemId = `${product.id}_var_${selectedVariation.id}_${timestamp}`;

    // Formatar adicionais para exibição na confirmação
    const selectedAddonItems = selectedAddons.map((addon) => ({
      name: addon.product.nome,
      quantity: addon.quantity,
    }));

    const companySlug = vm.profile.empresa.slug;
    const companyName = vm.profile.nome;

    // Adicionar o produto principal ao carrinho e obter o ID gerado
    const itemId = cartVm.addProductWithVariation(
      product,
      companySlug,
      companyName,
      selectedVariation.id,
      selectedVariation.name,
      parseFloat(
        selectedVariation.promotional_price || selectedVariation.price
      ),
      selectedVariation.description ?? undefined,
      quantity,
      observation.trim()
    );

    // Adicionar os adicionais selecionados usando o ID específico do item pai
    selectedAddons.forEach((addon) => {
      if (addon.quantity > 0) {
        cartVm.addAddonToCart(
          addon.product,
          companySlug,
          companyName,
          itemId, // Use o ID retornado pela função addProductWithVariation
          addon.quantity,
          `${product.nome} (${selectedVariation.name})`
        );
      }
    });

    // Calcular o valor total para exibição
    const variationPrice = parseFloat(
      selectedVariation.promotional_price || selectedVariation.price
    );
    const totalAmount = variationPrice * quantity;

    // Salvar informações do item para o modal de confirmação
    setLastAddedItem({
      productName: product.nome,
      quantity,
      totalPrice: formatCurrency(totalAmount),
      variationName: selectedVariation.name,
      addonItems: selectedAddonItems,
      observation: observation.trim(),
    });

    // Mostrar modal de confirmação
    showConfirmation();
  }, [
    product,
    vm.profile,
    selectedVariation,
    quantity,
    selectedAddons,
    observation,
    cartVm,
    showConfirmation,
  ]);

  // Share product
  const handleShareProduct = async () => {
    if (!product || !vm.profile) return;

    const productName = product.nome;
    const companyName = vm.profile.nome;
    const variationName = selectedVariation
      ? ` (${selectedVariation.name})`
      : "";

    let shareUrl = "";
    const shareMessage = `Confira ${productName}${variationName} em ${companyName}`;

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
        title: `${productName}${variationName} - ${companyName}`,
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
    showObservationInput,
    isImageViewerVisible,
    variationOptions,
    selectedVariation,
    loadingVariations,
    variationError,
    selectedAddons,
    isConfirmationVisible,
    lastAddedItem,

    // Calculated properties
    maxQuantity,
    discountPercent: calculateDiscount(),
    formattedTotal: calculateTotal(),
    primaryColor: vm.primaryColor || "#F4511E",
    currentImage: getCurrentImage(),

    // Actions
    increaseQuantity,
    decreaseQuantity,
    toggleObservationInput,
    setObservation,
    selectVariation,
    addToCart,
    handleShareProduct,
    handleOpenImageViewer,
    handleCloseImageViewer,
    addAddonToCart,
    getAddonQuantity,
    removeAddonFromCart,
    showConfirmation,
    hideConfirmation,
    resetState,
  };
}
