// Path: src/utils/navigation.utils.ts
import { DrawerActions } from "@react-navigation/native";

/**
 * Utilitários seguros para navegação que evitam erros comuns
 */
export const navigationUtils = {
  /**
   * Abre o drawer de forma segura
   * @param navigation Objeto de navegação do React Navigation
   */
  openDrawer: (navigation: any) => {
    if (!navigation) return;

    try {
      navigation.dispatch(DrawerActions.openDrawer());
    } catch (error) {
      console.log("Não foi possível abrir o drawer:", error);
    }
  },

  /**
   * Fecha o drawer de forma segura
   * @param navigation Objeto de navegação do React Navigation
   */
  closeDrawer: (navigation: any) => {
    if (!navigation) return;

    try {
      navigation.dispatch(DrawerActions.closeDrawer());
    } catch (error) {
      console.log("Não foi possível fechar o drawer:", error);
    }
  },

  /**
   * Alterna o estado do drawer de forma segura
   * @param navigation Objeto de navegação do React Navigation
   */
  toggleDrawer: (navigation: any) => {
    if (!navigation) return;

    try {
      navigation.dispatch(DrawerActions.toggleDrawer());
    } catch (error) {
      console.log("Não foi possível alternar o drawer:", error);
    }
  },
};
