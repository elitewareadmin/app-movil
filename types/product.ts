export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  imageUrl: string;
  images: string[];
  colors: string[];
  sizes: string[];
  materials: string[];
  inStock: boolean;
  inWishlist: boolean;
  hasModel3D: boolean;
  model3DUrl?: string;
}