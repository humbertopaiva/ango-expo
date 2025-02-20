// social-utils.ts

const SOCIAL_CONFIGS = {
  instagram: {
    baseUrl: "https://instagram.com/",
    validateUsername: (username: string) =>
      /^[\w.](?!.*?\.{2})[\w.]{1,28}[\w]$/.test(username),
    extractUsername: (url: string) => {
      if (!url) return "";
      try {
        const urlObj = new URL(url);
        if (
          urlObj.hostname === "instagram.com" ||
          urlObj.hostname === "www.instagram.com"
        ) {
          return urlObj.pathname.split("/").filter(Boolean)[0];
        }
      } catch {
        return url.replace(/[@]/g, "");
      }
      return url;
    },
    formatUrl: (input: string) => {
      if (!input) return "";
      if (input.startsWith("http")) {
        return input;
      }
      return `https://instagram.com/${input.replace(/[@]/g, "")}`;
    },
  },
  facebook: {
    baseUrl: "https://facebook.com/",
    validateUsername: (username: string) => /^[a-zA-Z0-9.]{4,}$/.test(username),
    extractUsername: (url: string) => {
      if (!url) return "";
      try {
        const urlObj = new URL(url);
        if (
          urlObj.hostname === "facebook.com" ||
          urlObj.hostname === "www.facebook.com"
        ) {
          return urlObj.pathname.split("/").filter(Boolean)[0];
        }
      } catch {
        return url;
      }
      return url;
    },
    formatUrl: (input: string) => {
      if (!input) return "";
      if (input.startsWith("http")) {
        return input;
      }
      return `https://facebook.com/${input}`;
    },
  },
  tiktok: {
    baseUrl: "https://tiktok.com/@",
    validateUsername: (username: string) => /^[\w][\w.]{2,23}$/.test(username),
    extractUsername: (url: string) => {
      if (!url) return "";
      try {
        const urlObj = new URL(url);
        if (
          urlObj.hostname === "tiktok.com" ||
          urlObj.hostname === "www.tiktok.com"
        ) {
          return urlObj.pathname.split("/").filter(Boolean)[0].replace("@", "");
        }
      } catch {
        return url.replace(/[@]/g, "");
      }
      return url;
    },
    formatUrl: (input: string) => {
      if (!input) return "";
      if (input.startsWith("http")) {
        return input;
      }
      return `https://tiktok.com/@${input.replace(/[@]/g, "")}`;
    },
  },
  youtube: {
    baseUrl: "https://youtube.com/@",
    validateUsername: (username: string) => /^[\w-]{3,}$/.test(username),
    extractUsername: (url: string) => {
      if (!url) return "";
      try {
        const urlObj = new URL(url);
        if (
          urlObj.hostname === "youtube.com" ||
          urlObj.hostname === "www.youtube.com"
        ) {
          return urlObj.pathname.split("/").filter(Boolean)[0].replace("@", "");
        }
      } catch {
        return url.replace(/[@]/g, "");
      }
      return url;
    },
    formatUrl: (input: string) => {
      if (!input) return "";
      if (input.startsWith("http")) {
        return input;
      }
      return `https://youtube.com/@${input.replace(/[@]/g, "")}`;
    },
  },
  twitter: {
    baseUrl: "https://twitter.com/",
    validateUsername: (username: string) =>
      /^[a-zA-Z0-9_]{4,15}$/.test(username),
    extractUsername: (url: string) => {
      if (!url) return "";
      try {
        const urlObj = new URL(url);
        if (
          urlObj.hostname === "twitter.com" ||
          urlObj.hostname === "www.twitter.com"
        ) {
          return urlObj.pathname.split("/").filter(Boolean)[0];
        }
      } catch {
        return url.replace(/[@]/g, "");
      }
      return url;
    },
    formatUrl: (input: string) => {
      if (!input) return "";
      if (input.startsWith("http")) {
        return input;
      }
      return `https://twitter.com/${input.replace(/[@]/g, "")}`;
    },
  },
  linkedin: {
    baseUrl: "https://linkedin.com/company/",
    validateUsername: (username: string) => /^[\w-]{3,}$/.test(username),
    extractUsername: (url: string) => {
      if (!url) return "";
      try {
        const urlObj = new URL(url);
        if (
          urlObj.hostname === "linkedin.com" ||
          urlObj.hostname === "www.linkedin.com"
        ) {
          const parts = urlObj.pathname.split("/").filter(Boolean);
          return parts[1] || "";
        }
      } catch {
        return url;
      }
      return url;
    },
    formatUrl: (input: string) => {
      if (!input) return "";
      if (input.startsWith("http")) {
        return input;
      }
      return `https://linkedin.com/company/${input}`;
    },
  },
};

export type SocialNetwork = keyof typeof SOCIAL_CONFIGS;

export const formatSocialUrl = (
  network: SocialNetwork,
  input: string
): string => {
  return SOCIAL_CONFIGS[network].formatUrl(input);
};

export const extractUsername = (
  network: SocialNetwork,
  url: string
): string => {
  return SOCIAL_CONFIGS[network].extractUsername(url);
};

export const validateUsername = (
  network: SocialNetwork,
  username: string
): boolean => {
  return SOCIAL_CONFIGS[network].validateUsername(username);
};

export const getBaseUrl = (network: SocialNetwork): string => {
  return SOCIAL_CONFIGS[network].baseUrl;
};
