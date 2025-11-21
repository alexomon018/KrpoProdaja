import { ProductType, UserType, ReviewType } from '@/lib/types';

export const mockUser: UserType = {
  id: '1',
  email: 'testuser@example.com',
  avatar: '/test-avatar.jpg',
  rating: 4.5,
  reviewCount: 10,
  itemsSold: 25,
  responseTime: '2 hours',
  memberSince: new Date('2023-01-01'),
};

export const mockReviewer: UserType = {
  id: '2',
  email: 'reviewer@example.com',
  avatar: '/reviewer-avatar.jpg',
  rating: 5,
  reviewCount: 15,
  memberSince: new Date('2022-06-01'),
};

export const mockProduct: ProductType = {
  id: '1',
  title: 'Test Product',
  price: 2500,
  originalPrice: 3000,
  images: ['/test-image1.jpg', '/test-image2.jpg'],
  condition: 'very-good',
  size: 'M',
  brand: 'Zara',
  category: 'women',
  description: 'Test product description',
  seller: mockUser,
  location: 'Beograd',
  createdAt: new Date('2024-01-01'),
  isSold: false,
};

export const mockProducts: ProductType[] = [
  mockProduct,
  {
    ...mockProduct,
    id: '2',
    title: 'Another Product',
    price: 1500,
    isSold: true,
  },
  {
    ...mockProduct,
    id: '3',
    title: 'Reserved Product',
    price: 2000,
    isReserved: true,
  },
];

export const mockReview: ReviewType = {
  id: '1',
  rating: 5,
  comment: 'Great seller, fast shipping!',
  reviewer: mockReviewer,
  createdAt: new Date('2024-01-15'),
};

export const mockReviews: ReviewType[] = [
  mockReview,
  {
    id: '2',
    rating: 4,
    comment: 'Good experience overall.',
    reviewer: mockReviewer,
    createdAt: new Date('2024-01-10'),
  },
];
