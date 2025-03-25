// Path: src/features/support/models/support.ts
export interface SupportContact {
  phone: string;
  email: string;
  hours?: string;
}

export interface SupportInfo {
  contact: SupportContact;
  defaultMessage: string;
}
