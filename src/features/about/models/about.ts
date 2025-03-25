// Path: src/features/about/models/about.ts
export interface AboutInfo {
  mission: string;
  vision: string;
  values: {
    title: string;
    description: string;
    icon?: string;
  }[];
  history: {
    title: string;
    description: string;
    year: string;
  }[];
  team: {
    name: string;
    role: string;
    photo?: string;
  }[];
  contact: {
    whatsapp: string;
    email: string;
    instagram?: string;
  };
}
