// Path: src/utils/pdf-utils.ts
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

/**
 * Utilities for handling PDF files
 */
export const pdfUtils = {
  /**
   * Download and save a PDF file to the device's cache
   * @param url URL of the PDF file
   * @param progressCallback Callback to track download progress
   * @returns Local file URI
   */
  async downloadPdf(
    url: string,
    progressCallback?: (progress: number) => void
  ): Promise<string> {
    try {
      // Extract filename from URL
      const fileName = url.split("/").pop() || "document.pdf";
      const localPath = `${FileSystem.cacheDirectory}${fileName}`;

      // Check if file already exists
      try {
        const fileInfo = await FileSystem.getInfoAsync(localPath);
        if (fileInfo.exists) {
          return localPath;
        }
      } catch (error) {
        console.log("File does not exist, downloading...");
      }

      // Download the file
      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        localPath,
        {},
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          if (progressCallback) progressCallback(progress);
        }
      );

      const { uri }: any = await downloadResumable.downloadAsync();
      return uri;
    } catch (error) {
      console.error("Error downloading PDF:", error);
      throw error;
    }
  },

  /**
   * Share a PDF file
   * @param uri Local URI of the PDF file
   * @param title Optional title for the share dialog
   */
  async sharePdf(uri: string, title?: string): Promise<void> {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: title || "Compartilhar PDF",
          UTI: "com.adobe.pdf", // for iOS
        });
      } else {
        throw new Error("Sharing is not available on this device");
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      throw error;
    }
  },

  /**
   * Get information about a PDF file from its URL
   * @param url URL of the PDF file
   * @returns Object containing file info
   */
  async getPdfInfo(url: string): Promise<{ size?: number; name?: string }> {
    try {
      const headResponse = await fetch(url, { method: "HEAD" });
      const contentLength = headResponse.headers.get("content-length");
      const contentDisposition = headResponse.headers.get(
        "content-disposition"
      );

      let fileName: string | undefined;
      if (contentDisposition) {
        const filenameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
          contentDisposition
        );
        if (filenameMatch && filenameMatch[1]) {
          fileName = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      if (!fileName) {
        fileName = url.split("/").pop() || undefined;
      }

      return {
        size: contentLength ? parseInt(contentLength, 10) : undefined,
        name: fileName,
      };
    } catch (error) {
      console.log("Error getting PDF info:", error);
      return {};
    }
  },
};
