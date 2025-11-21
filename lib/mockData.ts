import type {
  ProductType,
  UserType,
  ReviewType,
  ReviewSummaryType,
} from "./types";

/**
 * Mock data for development and demonstration
 * Replace with real API calls in production
 */

export const mockUsers: UserType[] = [
  {
    id: "1",
    email: "marija.k@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 4.9,
    reviewCount: 127,
    responseTime: "2h",
    memberSince: new Date("2022-03-15"),
    itemsForSale: 24,
    itemsSold: 98,
  },
  {
    id: "2",
    email: "stefan.m@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 4.7,
    reviewCount: 83,
    responseTime: "3h",
    memberSince: new Date("2021-06-20"),
    itemsForSale: 18,
    itemsSold: 156,
  },
  {
    id: "3",
    email: "ana.p@example.com",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5.0,
    reviewCount: 45,
    responseTime: "1h",
    memberSince: new Date("2023-01-10"),
    itemsForSale: 32,
    itemsSold: 67,
  },
  {
    id: "4",
    email: "nikola.d@example.com",
    rating: 4.8,
    reviewCount: 212,
    responseTime: "4h",
    memberSince: new Date("2020-08-05"),
    itemsForSale: 15,
    itemsSold: 324,
  },
];

export const mockProducts: ProductType[] = [
  {
    id: "1",
    title: "Zara crna haljina sa etiketom",
    description:
      "Prelepa crna haljina, nikad nošena, sa etiketom. Kupljena u Zari pre mesec dana, ali mi ne odgovara veličina.",
    price: 2500,
    originalPrice: 4990,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=400&fit=crop",
    ],
    size: "M",
    condition: "new",
    brand: "Zara",
    color: "Crna",
    material: "Poliester 95%, Elastin 5%",
    category: "women-dresses",
    location: "Beograd",
    seller: mockUsers[0],
    createdAt: new Date("2024-01-15"),
    isFavorite: false,
  },
  {
    id: "2",
    title: "H&M bela bluza",
    price: 800,
    originalPrice: 1990,
    images: [
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400&h=400&fit=crop",
    ],
    size: "S",
    condition: "very-good",
    brand: "H&M",
    color: "Bela",
    category: "women-tops",
    location: "Novi Sad",
    seller: mockUsers[1],
    createdAt: new Date("2024-01-14"),
  },
  {
    id: "3",
    title: "Nike patike Air Max",
    description:
      "Original Nike Air Max patike, nošene nekoliko puta. Veoma očuvane.",
    price: 6500,
    originalPrice: 12990,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    ],
    size: "L",
    condition: "very-good",
    brand: "Nike",
    color: "Bela/Crvena",
    category: "shoes",
    location: "Beograd",
    seller: mockUsers[2],
    createdAt: new Date("2024-01-13"),
    isFavorite: true,
  },
  {
    id: "4",
    title: "Mango kožna jakna",
    price: 4200,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    ],
    size: "M",
    condition: "good",
    brand: "Mango",
    color: "Crna",
    category: "women-jackets",
    location: "Niš",
    seller: mockUsers[3],
    createdAt: new Date("2024-01-12"),
  },
  {
    id: "5",
    title: "Reserved trenerka",
    price: 1800,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    ],
    size: "L",
    condition: "good",
    brand: "Reserved",
    color: "Siva",
    category: "women-sportswear",
    location: "Beograd",
    seller: mockUsers[0],
    createdAt: new Date("2024-01-11"),
  },
  {
    id: "6",
    title: "Pull&Bear farmerke",
    price: 1200,
    originalPrice: 2990,
    images: [
      "https://images.unsplash.com/photo-1542272454315-7b9b90c9d583?w=400&h=400&fit=crop",
    ],
    size: "M",
    condition: "very-good",
    brand: "Pull&Bear",
    color: "Plava",
    category: "women-jeans",
    location: "Kragujevac",
    seller: mockUsers[1],
    createdAt: new Date("2024-01-10"),
    isSold: true,
  },
  {
    id: "7",
    title: "Bershka crop top",
    price: 600,
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop",
    ],
    size: "S",
    condition: "very-good",
    brand: "Bershka",
    color: "Bela",
    category: "women-tops",
    location: "Subotica",
    seller: mockUsers[2],
    createdAt: new Date("2024-01-09"),
  },
  {
    id: "8",
    title: "Zara zelena suknja",
    price: 1500,
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=400&fit=crop",
    ],
    size: "M",
    condition: "new",
    brand: "Zara",
    color: "Zelena",
    category: "women-skirts",
    location: "Beograd",
    seller: mockUsers[3],
    createdAt: new Date("2024-01-08"),
    isReserved: true,
  },
];

/**
 * Mock Review Data
 */
export const mockReviews: Record<string, ReviewType[]> = {
  "1": [
    {
      id: "r1",
      rating: 5,
      comment:
        "The Zara dress's unique design is a warm addition to my wardrobe. I can hardly wait to wear it again next season!",
      reviewer: {
        id: "5",
        email: "user5@example.com",
        memberSince: new Date("2023-05-10"),
      },
      createdAt: new Date("2025-01-14"),
      reviewType: "appearance",
    },
    {
      id: "r2",
      rating: 5,
      comment:
        "Beautiful and with an original design. Arrived on time and very happy with it",
      reviewer: {
        id: "6",
        email: "user6@example.com",
        memberSince: new Date("2022-08-20"),
      },
      createdAt: new Date("2025-01-01"),
      reviewType: "this-item",
      sellerResponse: {
        comment: "Thank you for your kind words!",
        createdAt: new Date("2025-01-02"),
      },
    },
    {
      id: "r3",
      rating: 5,
      comment:
        "Fast shipping and excellent packaging. Item exactly as described.",
      reviewer: {
        id: "7",
        email: "user7@example.com",
        memberSince: new Date("2023-02-14"),
      },
      createdAt: new Date("2024-12-28"),
      reviewType: "delivery-packaging",
    },
    {
      id: "r4",
      rating: 5,
      comment: "Great seller, very responsive to messages!",
      reviewer: {
        id: "8",
        email: "user8@example.com",
        memberSince: new Date("2021-11-05"),
      },
      createdAt: new Date("2024-12-25"),
      reviewType: "seller-service",
    },
    {
      id: "r5",
      rating: 5,
      comment: "Perfect condition, exactly as shown in photos.",
      reviewer: {
        id: "9",
        email: "user9@example.com",
        memberSince: new Date("2022-07-19"),
      },
      createdAt: new Date("2024-12-20"),
      reviewType: "condition",
    },
  ],
  "3": [
    {
      id: "r6",
      rating: 5,
      comment:
        "Amazing Nike shoes! Very comfortable and look brand new. Fast delivery too!",
      reviewer: {
        id: "10",
        email: "petar.k@example.com",
        firstName: "Petar",
        lastName: "K.",
        memberSince: new Date("2022-03-10"),
      },
      createdAt: new Date("2025-01-12"),
      reviewType: "this-item",
    },
    {
      id: "r7",
      rating: 4,
      comment:
        "Good quality shoes, minor wear but overall great value for money.",
      reviewer: {
        id: "11",
        email: "milica.r@example.com",
        firstName: "Milica",
        lastName: "R.",
        memberSince: new Date("2023-06-15"),
      },
      createdAt: new Date("2025-01-08"),
      reviewType: "condition",
    },
    {
      id: "r8",
      rating: 5,
      comment:
        "Perfect size and fit. Seller was very helpful with sizing questions.",
      reviewer: {
        id: "12",
        email: "dusan.m@example.com",
        firstName: "Dušan",
        lastName: "M.",
        memberSince: new Date("2021-09-22"),
      },
      createdAt: new Date("2025-01-05"),
      reviewType: "seller-service",
      sellerResponse: {
        comment: "Thank you! Glad I could help with the sizing!",
        createdAt: new Date("2025-01-06"),
      },
    },
  ],
};

/**
 * Mock Review Summaries
 */
export const mockReviewSummaries: Record<string, ReviewSummaryType> = {
  "1": {
    averageRating: 5.0,
    totalReviews: 5,
    ratingBreakdown: {
      itemQuality: 5.0,
      delivery: 5.0,
      customerService: 5.0,
    },
    recommendationPercentage: 100,
    highlights: [
      "Fast delivery",
      "Beautiful",
      "Unique",
      "Great design",
      "Happy customer",
      "Responsive seller",
      "Excellent customer service",
    ],
  },
  "3": {
    averageRating: 4.7,
    totalReviews: 3,
    ratingBreakdown: {
      itemQuality: 4.7,
      delivery: 5.0,
      customerService: 5.0,
    },
    recommendationPercentage: 100,
    highlights: [
      "Comfortable",
      "Brand new look",
      "Fast delivery",
      "Great value",
      "Helpful seller",
    ],
  },
};
