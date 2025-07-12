export interface Product {
  id: number;
  name: string;
  subtitle: string;
  image: string;
  href: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Standard Business Cards",
    subtitle: "Common sizes, stocks, and finishes",
    image: "/placeholder.svg?width=400&height=300",
    href: "/standard-business-cards",
  },
  {
    id: 2,
    name: "Premium Business Cards",
    subtitle: "Thicker stocks and luxury finishes",
    image: "/placeholder.svg?width=400&height=300",
    href: "#",
  },
  {
    id: 3,
    name: "Plastic Business Cards",
    subtitle: "Durable and unique plastic cards",
    image: "/placeholder.svg?width=400&height=300",
    href: "#",
  },
  // ... Add 18 more products to make 21 total
  ...Array.from({ length: 18 }, (_, i) => ({
    id: i + 4,
    name: `Business Card Style ${i + 4}`,
    subtitle: "Another great option",
    image: `/placeholder.svg?width=400&height=300&query=business+card+design+${
      i + 4
    }`,
    href: "#",
  })),
];

export const productDetails = {
  name: "Standard Business Cards",
  subtitle: "The classic choice for professionals.",
  price: 4.53,
  images: [
    {
      src: "/placeholder.svg?width=600&height=600",
      alt: "Business Card Front",
    },
    { src: "/placeholder.svg?width=600&height=600", alt: "Business Card Back" },
    {
      src: "/placeholder.svg?width=600&height=600",
      alt: "Stack of Business Cards",
    },
    {
      src: "/placeholder.svg?width=600&height=600",
      alt: "Business Card in Hand",
    },
  ],
  description:
    "Our Standard Business Cards are printed on high-quality cardstock with a variety of coating options. They are perfect for making a professional impression without breaking the bank. Choose from multiple sizes and corner options to create a card that is uniquely yours.",
  specs: {
    Stock: "16pt C2S Cardstock",
    Coating: "Matte or UV Gloss",
    Sizes: '2" x 3.5", 2.5" x 2.5"',
    Turnaround: "2-4 Business Days",
    Color: "Full Color Front & Back (4/4)",
  },
};

// Artwork Module Data
export interface ProductSize {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: string;
  category: string;
  popular?: boolean;
}

export interface BleedOption {
  id: string;
  name: string;
  value: number;
  unit: string;
  description: string;
}

export interface ArtworkSideOption {
  id: string;
  name: string;
  value: "front" | "back" | "both";
  description: string;
}

export const productSizes: ProductSize[] = [
  // Business Cards
  {
    id: "bc-standard",
    name: "Standard Business Card",
    width: 3.5,
    height: 2,
    unit: "inches",
    category: "Business Cards",
    popular: true,
  },
  {
    id: "bc-square",
    name: "Square Business Card",
    width: 2.5,
    height: 2.5,
    unit: "inches",
    category: "Business Cards",
  },
  {
    id: "bc-slim",
    name: "Slim Business Card",
    width: 3.5,
    height: 1.5,
    unit: "inches",
    category: "Business Cards",
  },
  {
    id: "bc-mini",
    name: "Mini Business Card",
    width: 2.75,
    height: 1.25,
    unit: "inches",
    category: "Business Cards",
  },

  // Postcards
  {
    id: "pc-4x6",
    name: '4" x 6" Postcard',
    width: 6,
    height: 4,
    unit: "inches",
    category: "Postcards",
    popular: true,
  },
  {
    id: "pc-5x7",
    name: '5" x 7" Postcard',
    width: 7,
    height: 5,
    unit: "inches",
    category: "Postcards",
    popular: true,
  },
  {
    id: "pc-6x9",
    name: '6" x 9" Postcard',
    width: 9,
    height: 6,
    unit: "inches",
    category: "Postcards",
  },
  {
    id: "pc-6x11",
    name: '6" x 11" Postcard',
    width: 11,
    height: 6,
    unit: "inches",
    category: "Postcards",
  },

  // Flyers
  {
    id: "fl-85x11",
    name: '8.5" x 11" Flyer',
    width: 11,
    height: 8.5,
    unit: "inches",
    category: "Flyers",
    popular: true,
  },
  {
    id: "fl-85x14",
    name: '8.5" x 14" Flyer',
    width: 14,
    height: 8.5,
    unit: "inches",
    category: "Flyers",
  },
  {
    id: "fl-11x17",
    name: '11" x 17" Flyer',
    width: 17,
    height: 11,
    unit: "inches",
    category: "Flyers",
  },

  // Posters
  {
    id: "ps-12x18",
    name: '12" x 18" Poster',
    width: 18,
    height: 12,
    unit: "inches",
    category: "Posters",
  },
  {
    id: "ps-18x24",
    name: '18" x 24" Poster',
    width: 24,
    height: 18,
    unit: "inches",
    category: "Posters",
    popular: true,
  },
  {
    id: "ps-24x36",
    name: '24" x 36" Poster',
    width: 36,
    height: 24,
    unit: "inches",
    category: "Posters",
  },

  // Brochures
  {
    id: "br-85x11",
    name: '8.5" x 11" Brochure',
    width: 11,
    height: 8.5,
    unit: "inches",
    category: "Brochures",
  },
  {
    id: "br-85x14",
    name: '8.5" x 14" Brochure',
    width: 14,
    height: 8.5,
    unit: "inches",
    category: "Brochures",
  },
  {
    id: "br-11x17",
    name: '11" x 17" Brochure',
    width: 17,
    height: 11,
    unit: "inches",
    category: "Brochures",
  },
];

export const bleedOptions: BleedOption[] = [
  {
    id: "no-bleed",
    name: "No Bleed",
    value: 0,
    unit: "inches",
    description: "No bleed area - artwork ends at trim line",
  },
  {
    id: "standard-bleed",
    name: "Standard Bleed",
    value: 0.125,
    unit: "inches",
    description: '1/8" bleed on all sides (recommended)',
  },
  {
    id: "extended-bleed",
    name: "Extended Bleed",
    value: 0.25,
    unit: "inches",
    description: '1/4" bleed on all sides',
  },
  {
    id: "custom-bleed",
    name: "Custom Bleed",
    value: 0.0625,
    unit: "inches",
    description: '1/16" bleed on all sides',
  },
];

export const artworkSideOptions: ArtworkSideOption[] = [
  {
    id: "front-only",
    name: "Front Only",
    value: "front",
    description: "Single-sided artwork (front face only)",
  },
  {
    id: "back-only",
    name: "Back Only",
    value: "back",
    description: "Single-sided artwork (back face only)",
  },
  {
    id: "both-sides",
    name: "Both Sides",
    value: "both",
    description: "Double-sided artwork (front and back)",
  },
];

export interface ArtworkConfiguration {
  productSize: ProductSize;
  bleedOption: BleedOption;
  artworkSides: ArtworkSideOption;
  canvasWidth: number;
  canvasHeight: number;
  bleed: number;
}

export const createArtworkConfiguration = (
  productSize: ProductSize,
  bleedOption: BleedOption,
  artworkSides: ArtworkSideOption
): ArtworkConfiguration => {
  const canvasWidth = productSize.width + bleedOption.value * 2;
  const canvasHeight = productSize.height + bleedOption.value * 2;

  return {
    productSize,
    bleedOption,
    artworkSides,
    canvasWidth,
    canvasHeight,
    bleed: bleedOption.value,
  };
};
