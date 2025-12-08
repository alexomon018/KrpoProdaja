import { render, screen } from '@/__tests__/utils/test-utils';
import { ProductDescription } from './ProductDescription';

describe('ProductDescription', () => {
  it('renders description text', () => {
    render(<ProductDescription description="This is a great product." />);
    expect(screen.getByText('This is a great product.')).toBeInTheDocument();
  });

  it('renders Description heading', () => {
    render(<ProductDescription description="Test description" />);
    expect(screen.getByRole('heading', { name: /opis/i })).toBeInTheDocument();
  });

  it('does not render Item Details section when no details provided', () => {
    render(<ProductDescription description="Test" />);
    expect(screen.queryByRole('heading', { name: /detalji/i })).not.toBeInTheDocument();
  });

  it('renders Item Details section when details are provided', () => {
    const details = [
      { label: 'Brand', value: 'Nike' },
      { label: 'Size', value: 'Large' },
    ];
    render(<ProductDescription description="Test" details={details} />);

    expect(screen.getByRole('heading', { name: /detalji/i })).toBeInTheDocument();
    expect(screen.getByText('Brand')).toBeInTheDocument();
    expect(screen.getByText('Nike')).toBeInTheDocument();
    expect(screen.getByText('Size')).toBeInTheDocument();
    expect(screen.getByText('Large')).toBeInTheDocument();
  });

  it('renders empty details array without Item Details section', () => {
    render(<ProductDescription description="Test" details={[]} />);
    expect(screen.queryByRole('heading', { name: /detalji/i })).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ProductDescription description="Test" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards ref to div element', () => {
    const ref = { current: null };
    render(<ProductDescription description="Test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
