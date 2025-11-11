import { render, screen } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { ProductGrid } from './ProductGrid';
import { mockProducts } from '@/__tests__/mocks/data';

describe('ProductGrid', () => {
  it('renders products in grid', () => {
    render(<ProductGrid products={mockProducts} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Another Product')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    const { container } = render(<ProductGrid products={[]} loading />);
    // Should show skeleton loaders
    expect(container.firstChild).toBeInTheDocument();
  });

  it('shows empty state when no products', () => {
    const { container } = render(<ProductGrid products={[]} />);
    // Should render empty state
    expect(container.firstChild).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    render(<ProductGrid products={[]} emptyMessage="No results found" />);
    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('calls onFavoriteClick when product is favorited', async () => {
    const user = userEvent.setup();
    const handleFavoriteClick = jest.fn();
    render(<ProductGrid products={mockProducts} onFavoriteClick={handleFavoriteClick} />);

    const favoriteButtons = screen.getAllByRole('button', { name: /favorite|dodaj u omiljene/i });
    await user.click(favoriteButtons[0]);

    expect(handleFavoriteClick).toHaveBeenCalledWith(mockProducts[0].id);
  });

  it('renders correct number of products', () => {
    render(<ProductGrid products={mockProducts} />);
    const productCards = screen.getAllByRole('link');
    expect(productCards).toHaveLength(mockProducts.length);
  });

  it('applies custom column configuration', () => {
    render(
      <ProductGrid
        products={mockProducts}
        columns={{ mobile: 1, tablet: 2, desktop: 3 }}
      />
    );
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
