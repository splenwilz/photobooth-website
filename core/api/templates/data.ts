// Demo template data based on actual files in public/Templates

import { Template } from "./types";

export const templates: Template[] = [
  // 4x6 Portrait
  {
    id: "tpl-001",
    name: "Rustic Portrait",
    slug: "rustic-portrait",
    description: "A beautiful rustic-themed full portrait template perfect for weddings and countryside events.",
    category: "4x6-portrait",
    layoutType: "4x6-1-Shot-Full",
    previewImage: "/Templates/4x6-1-Shot-Full/Rustic-Portrait/preview.png",
    previewImages: [
      "/Templates/4x6-1-Shot-Full/Rustic-Portrait/preview.png",
      "/Templates/4x6-1-Shot-Full/Rustic-Portrait/template.png",
      "/Templates/4x6-1-Shot-Full/Rustic-Portrait/template1.png",
    ],
    price: 12.99,
    originalPrice: 19.99,
    isFree: false,
    isNew: false,
    isFeatured: true,
    tags: ["rustic", "wedding", "portrait", "vintage"],
    downloads: 1247,
    rating: 4.8,
    reviewCount: 89,
  },

  // Strip 2-Shot
  {
    id: "tpl-002",
    name: "Double Take",
    slug: "double-take",
    description: "Classic two-shot strip layout with clean borders. Great for any event type.",
    category: "strip-2-shot",
    layoutType: "Strip-2-Shot-Full",
    previewImage: "/Templates/Strip-2-Shot-Full/Double-Take/preview.png",
    previewImages: [
      "/Templates/Strip-2-Shot-Full/Double-Take/preview.png",
      "/Templates/Strip-2-Shot-Full/Double-Take/preview1.png",
      "/Templates/Strip-2-Shot-Full/Double-Take/template.png",
    ],
    price: 9.99,
    isFree: false,
    isNew: false,
    isFeatured: false,
    tags: ["classic", "minimal", "duo", "clean"],
    downloads: 2341,
    rating: 4.6,
    reviewCount: 156,
  },

  // Strip 3-Shot Circle
  {
    id: "tpl-003",
    name: "Circle Trio",
    slug: "circle-trio",
    description: "Elegant circular frames that add a soft, modern touch to your photo strips.",
    category: "strip-3-shot",
    layoutType: "Strip-3-Shot-Circle",
    previewImage: "/Templates/Strip-3-Shot-Circle/Circle-Trio/preview.png",
    previewImages: [
      "/Templates/Strip-3-Shot-Circle/Circle-Trio/preview.png",
      "/Templates/Strip-3-Shot-Circle/Circle-Trio/preview1.png",
      "/Templates/Strip-3-Shot-Circle/Circle-Trio/template.png",
    ],
    price: 14.99,
    originalPrice: 19.99,
    isFree: false,
    isNew: true,
    isFeatured: true,
    tags: ["circle", "modern", "elegant", "soft"],
    downloads: 892,
    rating: 4.9,
    reviewCount: 67,
  },

  // Strip 3-Shot Heart
  {
    id: "tpl-004",
    name: "Heart Trio",
    slug: "heart-trio",
    description: "Romantic heart-shaped frames perfect for weddings, Valentine's events, and couple celebrations.",
    category: "strip-3-shot",
    layoutType: "Strip-3-Shot-Heart",
    previewImage: "/Templates/Strip-3-Shot-Heart/Heart-Trio/preview.png",
    previewImages: [
      "/Templates/Strip-3-Shot-Heart/Heart-Trio/preview.png",
      "/Templates/Strip-3-Shot-Heart/Heart-Trio/preview1.png",
      "/Templates/Strip-3-Shot-Heart/Heart-Trio/template.png",
    ],
    price: 14.99,
    isFree: false,
    isNew: false,
    isFeatured: true,
    tags: ["heart", "romantic", "wedding", "love", "valentine"],
    downloads: 3456,
    rating: 4.9,
    reviewCount: 234,
  },

  // Strip 3-Shot Petal
  {
    id: "tpl-005",
    name: "Petal Trio",
    slug: "petal-trio",
    description: "Unique petal-shaped frames inspired by nature. Perfect for garden parties and spring events.",
    category: "strip-3-shot",
    layoutType: "Strip-3-Shot-Petal",
    previewImage: "/Templates/Strip-3-Shot-Petal/Petal-Trio/preview.png",
    previewImages: [
      "/Templates/Strip-3-Shot-Petal/Petal-Trio/preview.png",
      "/Templates/Strip-3-Shot-Petal/Petal-Trio/preview1.png",
      "/Templates/Strip-3-Shot-Petal/Petal-Trio/template.png",
    ],
    price: 11.99,
    isFree: false,
    isNew: true,
    isFeatured: false,
    tags: ["petal", "nature", "floral", "spring", "garden"],
    downloads: 567,
    rating: 4.7,
    reviewCount: 45,
  },

  // Strip 3-Shot Rounded
  {
    id: "tpl-006",
    name: "Soft Trio",
    slug: "soft-trio",
    description: "Gently rounded corners for a soft, approachable look. Works great for any occasion.",
    category: "strip-3-shot",
    layoutType: "Strip-3-Shot-Rounded",
    previewImage: "/Templates/Strip-3-Shot-Rounded/Soft-Trio/preview.png",
    previewImages: [
      "/Templates/Strip-3-Shot-Rounded/Soft-Trio/preview.png",
      "/Templates/Strip-3-Shot-Rounded/Soft-Trio/preview1.png",
      "/Templates/Strip-3-Shot-Rounded/Soft-Trio/template.png",
    ],
    price: 0,
    isFree: true,
    isNew: false,
    isFeatured: false,
    tags: ["rounded", "soft", "minimal", "versatile"],
    downloads: 8234,
    rating: 4.5,
    reviewCount: 412,
  },

  // Strip 3-Shot Square
  {
    id: "tpl-007",
    name: "Square Trio",
    slug: "square-trio",
    description: "Clean square frames with a contemporary feel. Perfect for corporate events and modern celebrations.",
    category: "strip-3-shot",
    layoutType: "Strip-3-Shot-Square",
    previewImage: "/Templates/Strip-3-Shot-Square/Square-Trio/preview.png",
    previewImages: [
      "/Templates/Strip-3-Shot-Square/Square-Trio/preview.png",
      "/Templates/Strip-3-Shot-Square/Square-Trio/preview1.png",
      "/Templates/Strip-3-Shot-Square/Square-Trio/template.png",
    ],
    price: 9.99,
    isFree: false,
    isNew: false,
    isFeatured: false,
    tags: ["square", "modern", "corporate", "clean"],
    downloads: 1876,
    rating: 4.6,
    reviewCount: 98,
  },

  // Strip 3-Shot Staggered
  {
    id: "tpl-008",
    name: "Staggered Trio",
    slug: "staggered-trio",
    description: "Dynamic staggered layout that adds movement and visual interest to your photo strips.",
    category: "strip-3-shot",
    layoutType: "Strip-3-Shot-Staggered",
    previewImage: "/Templates/Strip-3-Shot-Staggered/Staggered-Trio/preview.png",
    previewImages: [
      "/Templates/Strip-3-Shot-Staggered/Staggered-Trio/preview.png",
      "/Templates/Strip-3-Shot-Staggered/Staggered-Trio/preview1.png",
      "/Templates/Strip-3-Shot-Staggered/Staggered-Trio/template.png",
    ],
    price: 12.99,
    isFree: false,
    isNew: false,
    isFeatured: false,
    tags: ["staggered", "dynamic", "creative", "unique"],
    downloads: 1234,
    rating: 4.7,
    reviewCount: 76,
  },

  // Strip 3-Shot Vertical Center Break
  {
    id: "tpl-009",
    name: "Girls Night",
    slug: "girls-night",
    description: "Fun center-break layout perfect for bachelorette parties and girls' night out events.",
    category: "strip-3-shot",
    layoutType: "Strip-3-Shot-Vertical-Center-Break",
    previewImage: "/Templates/Strip-3-Shot-Vertical-Center-Break/Girls-Night/preview.png",
    previewImages: [
      "/Templates/Strip-3-Shot-Vertical-Center-Break/Girls-Night/preview.png",
      "/Templates/Strip-3-Shot-Vertical-Center-Break/Girls-Night/template.png",
    ],
    price: 14.99,
    originalPrice: 19.99,
    isFree: false,
    isNew: true,
    isFeatured: true,
    tags: ["party", "bachelorette", "fun", "girls night", "celebration"],
    downloads: 2145,
    rating: 4.8,
    reviewCount: 167,
  },

  // Strip 3-Shot Vertical Equal
  {
    id: "tpl-010",
    name: "Classic Trio",
    slug: "classic-trio",
    description: "Timeless equal-height vertical layout. The most popular choice for all event types.",
    category: "strip-3-shot",
    layoutType: "Strip-3-Shot-Vertical-Equal",
    previewImage: "/Templates/Strip-3-Shot-Vertical-Equal/Classic-Trio/preview.png",
    previewImages: [
      "/Templates/Strip-3-Shot-Vertical-Equal/Classic-Trio/preview.png",
      "/Templates/Strip-3-Shot-Vertical-Equal/Classic-Trio/preview1.png",
      "/Templates/Strip-3-Shot-Vertical-Equal/Classic-Trio/template.png",
    ],
    price: 0,
    isFree: true,
    isNew: false,
    isFeatured: false,
    tags: ["classic", "timeless", "equal", "vertical", "popular"],
    downloads: 15678,
    rating: 4.8,
    reviewCount: 892,
  },

  // Strip 3-Shot Vertical Footer
  {
    id: "tpl-011",
    name: "Good Vibes Plus",
    slug: "good-vibes-plus",
    description: "Vertical layout with a footer area for branding, dates, or custom messages.",
    category: "strip-3-shot",
    layoutType: "Strip-3-Shot-Vertical-Footer",
    previewImage: "/Templates/Strip-3-Shot-Vertical-Footer/Good-Vibes-Plus/preview.png",
    previewImages: [
      "/Templates/Strip-3-Shot-Vertical-Footer/Good-Vibes-Plus/preview.png",
      "/Templates/Strip-3-Shot-Vertical-Footer/Good-Vibes-Plus/template.png",
    ],
    price: 11.99,
    isFree: false,
    isNew: false,
    isFeatured: false,
    tags: ["footer", "branding", "custom", "message", "logo"],
    downloads: 3456,
    rating: 4.6,
    reviewCount: 198,
  },

  // Strip 4-Shot Classic
  {
    id: "tpl-012",
    name: "Classic Quad",
    slug: "classic-quad",
    description: "The iconic 4-shot photo strip layout. A timeless classic that everyone loves.",
    category: "strip-4-shot",
    layoutType: "Strip-4-Shot-Classic",
    previewImage: "/Templates/Strip-4-Shot-Classic/Classic-Quad/preview.png",
    previewImages: [
      "/Templates/Strip-4-Shot-Classic/Classic-Quad/preview.png",
      "/Templates/Strip-4-Shot-Classic/Classic-Quad/preview1.png",
      "/Templates/Strip-4-Shot-Classic/Classic-Quad/template.png",
    ],
    price: 9.99,
    isFree: false,
    isNew: false,
    isFeatured: true,
    tags: ["classic", "quad", "traditional", "iconic", "4-shot"],
    downloads: 12456,
    rating: 4.9,
    reviewCount: 756,
  },

  // Strip 4-Shot Rounded
  {
    id: "tpl-013",
    name: "Soft Quad",
    slug: "soft-quad",
    description: "Four-shot layout with rounded corners for a modern, softer appearance.",
    category: "strip-4-shot",
    layoutType: "Strip-4-Shot-Rounded",
    previewImage: "/Templates/Strip-4-Shot-Rounded/Soft-Quad/preview.png",
    previewImages: [
      "/Templates/Strip-4-Shot-Rounded/Soft-Quad/preview.png",
      "/Templates/Strip-4-Shot-Rounded/Soft-Quad/preview1.png",
      "/Templates/Strip-4-Shot-Rounded/Soft-Quad/template.png",
    ],
    price: 11.99,
    isFree: false,
    isNew: true,
    isFeatured: false,
    tags: ["rounded", "quad", "modern", "soft", "4-shot"],
    downloads: 2345,
    rating: 4.7,
    reviewCount: 134,
  },
];

// Helper functions
export function getTemplatesByCategory(category: string): Template[] {
  if (category === "all") return templates;
  return templates.filter((t) => t.category === category);
}

export function getFeaturedTemplates(): Template[] {
  return templates.filter((t) => t.isFeatured);
}

export function getNewTemplates(): Template[] {
  return templates.filter((t) => t.isNew);
}

export function getFreeTemplates(): Template[] {
  return templates.filter((t) => t.isFree);
}

export function getTemplateBySlug(slug: string): Template | undefined {
  return templates.find((t) => t.slug === slug);
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function searchTemplates(query: string): Template[] {
  const lowerQuery = query.toLowerCase();
  return templates.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}
