// Path: src/features/company-page/view-models/product-variation.view-model.ts
import { useState, useEffect } from "react";
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

interface VariationOption {
  id: string;
  name: string;
  price: string;
  promotional_price: string | null;
  description: string | null;
  image: string | null;
  available: boolean;
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
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value);
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

  // Calculate total price based on quantity and selected variation
  const calculateTotal = (): string => {
    if (!selectedVariation && !product) return formatCurrency("0");

    let price = 0;
    if (selectedVariation) {
      price = parseFloat(
        selectedVariation.promotional_price || selectedVariation.price
      );
    } else if (product) {
      price = parseFloat(product.preco_promocional || product.preco);
    }

    return formatCurrency((price * quantity).toString());
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

  const addToCart = () => {
    if (!product || !vm.profile || !selectedVariation) return;

    const companySlug = vm.profile.empresa.slug;
    const companyName = vm.profile.nome;

    // Create a product with variation to add to cart
    const productWithVariation: ProductWithVariation = {
      ...product,
      produto_variado: {
        id: selectedVariation.id,
        valor_variacao: selectedVariation.name,
        preco: selectedVariation.price,
        preco_promocional: selectedVariation.promotional_price,
        descricao: selectedVariation.description,
        imagem: selectedVariation.image,
        disponivel: true,
      },
    };

    // Add item to company's cart
    cartVm.addToCartWithObservation(
      productWithVariation,
      companySlug,
      companyName,
      quantity,
      observation.trim()
    );

    // Show success toast
    toastUtils.success(
      toast,
      `${product.nome} (${selectedVariation.name}) adicionado ao carrinho!`
    );
  };

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
  };
}
