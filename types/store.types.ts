export type DeliveryType = "DELIVERY" | "PICKUP";

export type LayoutStyle = "grid" | "list";

export interface StoreAddress {
  street: string | null;
  number: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  complement?: string | null;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  street: string | null;
  number: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  complement?: string | null;
  supportedDeliveryTypes: DeliveryType[];
  logoUrl: string | null;
  themeColor: string | null;
  layoutStyle: LayoutStyle | null;
  fontFamily: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateStoreRequest {
  name?: string;
  slug?: string;
  street?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  complement?: string | null;
  supportedDeliveryTypes?: DeliveryType[];
  themeColor?: string;
  layoutStyle?: LayoutStyle;
  fontFamily?: string;
  imageBase64?: string; // quando alterar o logo
}
