// Path: src/utils/mime.utils.ts

export const mimeUtils = {
  /**
   * Obtém a extensão de um arquivo a partir da URL
   */
  getExtensionFromUrl(url: string): string {
    try {
      const urlParts = url.split("?")[0].split(".");
      return urlParts[urlParts.length - 1].toLowerCase();
    } catch (e) {
      return "";
    }
  },

  /**
   * Verifica se uma URL é de um arquivo PDF
   */
  isPdfUrl(url: string): boolean {
    if (!url) return false;
    const extension = this.getExtensionFromUrl(url);
    return extension === "pdf";
  },

  /**
   * Verifica se uma URL é de uma imagem
   */
  isImageUrl(url: string): boolean {
    if (!url) return false;
    const extension = this.getExtensionFromUrl(url);
    return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension);
  },
};
