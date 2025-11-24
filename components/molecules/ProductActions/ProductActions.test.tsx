import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import { ProductActions } from './ProductActions';

describe('ProductActions', () => {
  const defaultProps = {
    sellerId: 'seller-123',
    productId: 'product-456',
  };

  it('renders Message Seller button', () => {
    render(<ProductActions {...defaultProps} />);
    expect(screen.getByRole('button', { name: /message seller/i })).toBeInTheDocument();
  });

  it('calls onMessageSeller when provided and button is clicked', () => {
    const mockOnMessageSeller = jest.fn();
    render(<ProductActions {...defaultProps} onMessageSeller={mockOnMessageSeller} />);

    fireEvent.click(screen.getByRole('button', { name: /message seller/i }));
    expect(mockOnMessageSeller).toHaveBeenCalledTimes(1);
  });

  it('logs to console when onMessageSeller is not provided', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<ProductActions {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /message seller/i }));
    expect(consoleSpy).toHaveBeenCalledWith(
      `Message seller ${defaultProps.sellerId} about product ${defaultProps.productId}`
    );
    consoleSpy.mockRestore();
  });

  it('applies custom className', () => {
    render(<ProductActions {...defaultProps} className="custom-class" />);
    const container = screen.getByRole('button', { name: /message seller/i }).parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('forwards ref to div element', () => {
    const ref = { current: null };
    render(<ProductActions {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
