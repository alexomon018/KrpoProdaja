import { render, screen } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { ProductCard } from './ProductCard';
import { mockProduct } from '@/__tests__/mocks/data';

describe('ProductCard', () => {
  it('renders product title', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText(/2\.500/)).toBeInTheDocument();
  });

  it('renders product image', () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('calls onFavoriteClick when favorite button clicked', async () => {
    const user = userEvent.setup();
    const handleFavoriteClick = jest.fn();
    render(<ProductCard product={mockProduct} onFavoriteClick={handleFavoriteClick} />);

    const buttons = screen.getAllByRole('button');
    if (buttons.length > 0) {
      await user.click(buttons[0]);
      expect(handleFavoriteClick).toHaveBeenCalled();
    }
  });

  it('shows sold badge for sold products', () => {
    const soldProduct = { ...mockProduct, isSold: true };
    render(<ProductCard product={soldProduct} />);
    expect(screen.getByText('Prodato')).toBeInTheDocument();
  });

  it('shows reserved badge for reserved products', () => {
    const reservedProduct = { ...mockProduct, isReserved: true };
    render(<ProductCard product={reservedProduct} />);
    expect(screen.getByText('Rezervisano')).toBeInTheDocument();
  });

  it('renders product link', () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
  });
});
