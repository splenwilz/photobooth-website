// Template types for the templates marketplace

export type TemplateCategory =
  | "4x6-portrait"
  | "strip-2-shot"
  | "strip-3-shot"
  | "strip-4-shot";

export type TemplateLayoutType =
  | "4x6-1-Shot-Full"
  | "Strip-2-Shot-Full"
  | "Strip-3-Shot-Circle"
  | "Strip-3-Shot-Heart"
  | "Strip-3-Shot-Petal"
  | "Strip-3-Shot-Rounded"
  | "Strip-3-Shot-Square"
  | "Strip-3-Shot-Staggered"
  | "Strip-3-Shot-Vertical-Center-Break"
  | "Strip-3-Shot-Vertical-Equal"
  | "Strip-3-Shot-Vertical-Footer"
  | "Strip-4-Shot-Classic"
  | "Strip-4-Shot-Rounded";

export interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: TemplateCategory;
  layoutType: TemplateLayoutType;
  previewImage: string;
  previewImages: string[];
  price: number;
  originalPrice?: number;
  isFree: boolean;
  isNew: boolean;
  isFeatured: boolean;
  tags: string[];
  downloads: number;
  rating: number;
  reviewCount: number;
}

export interface CartItem {
  template: Template;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}

// Category metadata for filtering
export const categoryMetadata: Record<TemplateCategory, { label: string; description: string }> = {
  "4x6-portrait": {
    label: "4x6 Portrait",
    description: "Full-size portrait layouts",
  },
  "strip-2-shot": {
    label: "2-Shot Strips",
    description: "Two photo layouts",
  },
  "strip-3-shot": {
    label: "3-Shot Strips",
    description: "Three photo layouts",
  },
  "strip-4-shot": {
    label: "4-Shot Strips",
    description: "Four photo classic strips",
  },
};

// Layout type metadata
export const layoutTypeMetadata: Record<TemplateLayoutType, { label: string; category: TemplateCategory }> = {
  "4x6-1-Shot-Full": { label: "Full Portrait", category: "4x6-portrait" },
  "Strip-2-Shot-Full": { label: "Double Take", category: "strip-2-shot" },
  "Strip-3-Shot-Circle": { label: "Circle Frames", category: "strip-3-shot" },
  "Strip-3-Shot-Heart": { label: "Heart Frames", category: "strip-3-shot" },
  "Strip-3-Shot-Petal": { label: "Petal Frames", category: "strip-3-shot" },
  "Strip-3-Shot-Rounded": { label: "Rounded Frames", category: "strip-3-shot" },
  "Strip-3-Shot-Square": { label: "Square Frames", category: "strip-3-shot" },
  "Strip-3-Shot-Staggered": { label: "Staggered Layout", category: "strip-3-shot" },
  "Strip-3-Shot-Vertical-Center-Break": { label: "Center Break", category: "strip-3-shot" },
  "Strip-3-Shot-Vertical-Equal": { label: "Equal Vertical", category: "strip-3-shot" },
  "Strip-3-Shot-Vertical-Footer": { label: "With Footer", category: "strip-3-shot" },
  "Strip-4-Shot-Classic": { label: "Classic Quad", category: "strip-4-shot" },
  "Strip-4-Shot-Rounded": { label: "Rounded Quad", category: "strip-4-shot" },
};
