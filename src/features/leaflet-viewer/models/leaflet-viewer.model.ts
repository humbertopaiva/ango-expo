// Path: src/features/leaflets/models/leaflet-viewer.model.ts

export interface LeafletPage {
  id: string;
  image: string;
}

export interface LeafletSourceType {
  id: string;
  name: string;
  pages: LeafletPage[];
  dateValid?: string;
  companyName?: string;
  companyLogo?: string | null;
}
