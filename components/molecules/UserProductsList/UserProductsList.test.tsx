import { render, screen } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { UserProductsList } from './UserProductsList';
import type { ApiProduct } from '@/lib/api/types';

// Mock ProductListItem and ProductListItemSkeleton
jest.mock('@molecules/ProductListItem', () => ({
  ProductListItem: ({ product, isOwnProduct, onDelete, onStatusChange }: any) => (
    <div data-testid={`product-${product.id}`}>
      <h3>{product.title}</h3>
      <span>{product.price} RSD</span>
      {isOwnProduct && onDelete && (
        <button onClick={() => onDelete(product.id)}>Obriši</button>
      )}
      {isOwnProduct && onStatusChange && (
        <button onClick={() => onStatusChange(product.id, 'sold')}>
          Prodato
        </button>
      )}
    </div>
  ),
  ProductListItemSkeleton: () => <div data-testid="skeleton-item">Loading...</div>,
}));

describe('UserProductsList', () => {
  const mockProducts: ApiProduct[] = [
    {
      id: '1',
      title: 'Summer Dress',
      price: 3500,
      status: 'active',
      images: ['https://example.com/dress.jpg'],
      userId: 'user1',
      categoryId: 'cat1',
      size: 'M',
      condition: 'very-good',
      description: 'Beautiful summer dress',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      title: 'Winter Jacket',
      price: 8000,
      status: 'reserved',
      images: ['https://example.com/jacket.jpg'],
      userId: 'user1',
      categoryId: 'cat2',
      size: 'L',
      condition: 'good',
      description: 'Warm winter jacket',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
  ];

  const mockOnDelete = jest.fn();
  const mockOnStatusChange = jest.fn();
  const mockOnFetchNextPage = jest.fn();

  const defaultProps = {
    products: mockProducts,
    isLoading: false,
    isOwnProducts: true,
    status: 'all',
    onDelete: mockOnDelete,
    onStatusChange: mockOnStatusChange,
    inline: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading States', () => {
    it('should render skeleton loaders when loading', () => {
      render(<UserProductsList {...defaultProps} isLoading />);

      const skeletons = screen.getAllByTestId('skeleton-item');
      expect(skeletons).toHaveLength(3);
    });

    it('should not render products when loading', () => {
      render(<UserProductsList {...defaultProps} isLoading />);

      expect(screen.queryByText('Summer Dress')).not.toBeInTheDocument();
      expect(screen.queryByText('Winter Jacket')).not.toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should show empty state for active status', () => {
      render(
        <UserProductsList
          {...defaultProps}
          products={[]}
          status="active"
        />
      );

      expect(
        screen.getByText('Korisnik trenutno nema aktivnih oglasa')
      ).toBeInTheDocument();
    });

    it('should show empty state for reserved status', () => {
      render(
        <UserProductsList
          {...defaultProps}
          products={[]}
          status="reserved"
        />
      );

      expect(
        screen.getByText('Korisnik trenutno nema rezervisanih oglasa')
      ).toBeInTheDocument();
    });

    it('should show empty state for sold status', () => {
      render(
        <UserProductsList
          {...defaultProps}
          products={[]}
          status="sold"
        />
      );

      expect(
        screen.getByText('Korisnik trenutno nema prodatih oglasa')
      ).toBeInTheDocument();
    });

    it('should show empty state for all status', () => {
      render(
        <UserProductsList
          {...defaultProps}
          products={[]}
          status="all"
        />
      );

      expect(
        screen.getByText('Korisnik trenutno nema oglasa')
      ).toBeInTheDocument();
    });

    it('should show inline empty state when inline prop is true', () => {
      render(
        <UserProductsList
          {...defaultProps}
          products={[]}
          inline
        />
      );

      expect(screen.getByText('Nema oglasa')).toBeInTheDocument();
    });

    it('should not show empty state when loading', () => {
      render(
        <UserProductsList
          {...defaultProps}
          products={[]}
          isLoading
        />
      );

      expect(
        screen.queryByText('Korisnik trenutno nema oglasa')
      ).not.toBeInTheDocument();
    });
  });

  describe('Product Rendering', () => {
    it('should render all products', () => {
      render(<UserProductsList {...defaultProps} />);

      expect(screen.getByText('Summer Dress')).toBeInTheDocument();
      expect(screen.getByText('Winter Jacket')).toBeInTheDocument();
    });

    it('should render products with correct data', () => {
      render(<UserProductsList {...defaultProps} />);

      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      expect(screen.getByText('3500 RSD')).toBeInTheDocument();
      expect(screen.getByText('8000 RSD')).toBeInTheDocument();
    });

    it('should pass isOwnProduct prop to ProductListItem', () => {
      render(<UserProductsList {...defaultProps} isOwnProducts />);

      // When isOwnProducts is true, action buttons should be rendered
      const deleteButtons = screen.getAllByText('Obriši');
      expect(deleteButtons).toHaveLength(2);
    });

    it('should not show action buttons when not own products', () => {
      render(<UserProductsList {...defaultProps} isOwnProducts={false} />);

      // When isOwnProducts is false, action buttons should not be rendered
      expect(screen.queryByText('Obriši')).not.toBeInTheDocument();
    });
  });

  describe('Product Interactions', () => {
    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<UserProductsList {...defaultProps} />);

      const deleteButtons = screen.getAllByText('Obriši');
      await user.click(deleteButtons[0]);

      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });

    it('should call onStatusChange when status button is clicked', async () => {
      const user = userEvent.setup();
      render(<UserProductsList {...defaultProps} />);

      const statusButtons = screen.getAllByText('Prodato');
      await user.click(statusButtons[0]);

      expect(mockOnStatusChange).toHaveBeenCalledWith('1', 'sold');
    });
  });

  describe('Infinite Scroll', () => {
    it('should not render load more section when hasNextPage is false', () => {
      render(<UserProductsList {...defaultProps} hasNextPage={false} />);

      expect(screen.queryByText('Učitaj još')).not.toBeInTheDocument();
    });

    it('should render load more button when hasNextPage is true', () => {
      render(
        <UserProductsList
          {...defaultProps}
          hasNextPage
          onFetchNextPage={mockOnFetchNextPage}
        />
      );

      expect(screen.getByText('Učitaj još')).toBeInTheDocument();
    });

    it('should show loading state when fetching next page', () => {
      render(
        <UserProductsList
          {...defaultProps}
          hasNextPage
          isFetchingNextPage
        />
      );

      expect(screen.getByText('Učitavanje...')).toBeInTheDocument();
      expect(screen.queryByText('Učitaj još')).not.toBeInTheDocument();
    });

    it('should call onFetchNextPage when load more button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <UserProductsList
          {...defaultProps}
          hasNextPage
          onFetchNextPage={mockOnFetchNextPage}
        />
      );

      const loadMoreButton = screen.getByText('Učitaj još');
      await user.click(loadMoreButton);

      expect(mockOnFetchNextPage).toHaveBeenCalled();
    });

    it('should show inline load more button text when inline prop is true', () => {
      render(
        <UserProductsList
          {...defaultProps}
          hasNextPage
          inline
          onFetchNextPage={mockOnFetchNextPage}
        />
      );

      expect(screen.getByText('Učitaj još oglasa')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single product', () => {
      const singleProduct = [mockProducts[0]];
      render(
        <UserProductsList {...defaultProps} products={singleProduct} />
      );

      expect(screen.getByText('Summer Dress')).toBeInTheDocument();
      expect(screen.queryByText('Winter Jacket')).not.toBeInTheDocument();
    });

    it('should handle many products', () => {
      const manyProducts = Array.from({ length: 10 }, (_, i) => ({
        ...mockProducts[0],
        id: `${i}`,
        title: `Product ${i}`,
      }));

      render(<UserProductsList {...defaultProps} products={manyProducts} />);

      expect(screen.getByText('Product 0')).toBeInTheDocument();
      expect(screen.getByText('Product 9')).toBeInTheDocument();
    });

    it('should work without onDelete callback', () => {
      render(<UserProductsList {...defaultProps} onDelete={undefined} />);

      expect(screen.getByText('Summer Dress')).toBeInTheDocument();
    });

    it('should work without onStatusChange callback', () => {
      render(<UserProductsList {...defaultProps} onStatusChange={undefined} />);

      expect(screen.getByText('Summer Dress')).toBeInTheDocument();
    });
  });
});
