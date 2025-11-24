import { render, screen, fireEvent, waitFor } from '@/__tests__/utils/test-utils';
import { ProductMeta } from './ProductMeta';

describe('ProductMeta', () => {
  const defaultProps = {
    productId: 'product-123',
  };

  it('renders view count', () => {
    render(<ProductMeta {...defaultProps} viewCount={1500} />);
    expect(screen.getByText('1,500 views')).toBeInTheDocument();
  });

  it('renders 0 views when no viewCount provided', () => {
    render(<ProductMeta {...defaultProps} />);
    expect(screen.getByText('0 views')).toBeInTheDocument();
  });

  it('renders Share button', () => {
    render(<ProductMeta {...defaultProps} />);
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
  });

  it('renders Report button', () => {
    render(<ProductMeta {...defaultProps} />);
    expect(screen.getByRole('button', { name: /report/i })).toBeInTheDocument();
  });

  it('calls onShare when provided and Share button is clicked', () => {
    const mockOnShare = jest.fn();
    render(<ProductMeta {...defaultProps} onShare={mockOnShare} />);

    fireEvent.click(screen.getByRole('button', { name: /share/i }));
    expect(mockOnShare).toHaveBeenCalledTimes(1);
  });

  it('calls onReport when provided and Report button is clicked', () => {
    const mockOnReport = jest.fn();
    render(<ProductMeta {...defaultProps} onReport={mockOnReport} />);

    fireEvent.click(screen.getByRole('button', { name: /report/i }));
    expect(mockOnReport).toHaveBeenCalledTimes(1);
  });

  it('shows alert and logs when Report button clicked without onReport handler', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();

    render(<ProductMeta {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /report/i }));

    expect(consoleSpy).toHaveBeenCalledWith(`Report product ${defaultProps.productId}`);
    expect(alertSpy).toHaveBeenCalledWith('Report functionality coming soon!');

    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('uses navigator.clipboard when navigator.share is not available', async () => {
    const mockClipboard = { writeText: jest.fn().mockResolvedValue(undefined) };
    Object.assign(navigator, { clipboard: mockClipboard, share: undefined });
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation();

    render(<ProductMeta {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalled();
    });
    expect(alertSpy).toHaveBeenCalledWith('Link copied to clipboard!');

    alertSpy.mockRestore();
  });

  it('applies custom className', () => {
    const { container } = render(<ProductMeta {...defaultProps} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards ref to div element', () => {
    const ref = { current: null };
    render(<ProductMeta {...defaultProps} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
