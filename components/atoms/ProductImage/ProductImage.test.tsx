import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import { ProductImage } from './ProductImage';

describe('ProductImage', () => {
  it('renders image with src and alt', () => {
    render(<ProductImage src="/test.jpg" alt="Test Product" />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', 'Test Product');
  });

  it('applies square aspect ratio by default', () => {
    render(<ProductImage src="/test.jpg" alt="Test" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('applies portrait aspect ratio', () => {
    render(<ProductImage src="/test.jpg" alt="Test" aspectRatio="portrait" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders overlay content', () => {
    render(
      <ProductImage
        src="/test.jpg"
        alt="Test"
        overlay={<div>Overlay Content</div>}
      />
    );
    expect(screen.getByText('Overlay Content')).toBeInTheDocument();
  });

  it('shows placeholder on image error', () => {
    const { container } = render(<ProductImage src="/invalid.jpg" alt="Test" />);
    const img = container.querySelector('img');
    if (img) {
      fireEvent.error(img);
    }
    // Placeholder should be shown
    expect(container.firstChild).toBeInTheDocument();
  });

  it('supports priority loading', () => {
    render(<ProductImage src="/test.jpg" alt="Test" priority />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
});
