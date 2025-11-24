import { render, screen } from '@/__tests__/utils/test-utils';
import { ShippingOptions } from './ShippingOptions';

describe('ShippingOptions', () => {
  const mockOptions = [
    {
      id: '1',
      name: 'Standard Shipping',
      price: 5.99,
      estimatedDays: '5-7 business days',
      icon: 'truck' as const,
    },
    {
      id: '2',
      name: 'Express Shipping',
      price: 12.99,
      estimatedDays: '2-3 business days',
      icon: 'package' as const,
    },
    {
      id: '3',
      name: 'Local Pickup',
      price: 0,
      estimatedDays: 'Same day',
      icon: 'mappin' as const,
    },
  ];

  it('renders Shipping Options heading', () => {
    render(<ShippingOptions options={mockOptions} />);
    expect(screen.getByRole('heading', { name: /shipping options/i })).toBeInTheDocument();
  });

  it('renders all shipping options', () => {
    render(<ShippingOptions options={mockOptions} />);

    expect(screen.getByText('Standard Shipping')).toBeInTheDocument();
    expect(screen.getByText('Express Shipping')).toBeInTheDocument();
    expect(screen.getByText('Local Pickup')).toBeInTheDocument();
  });

  it('renders estimated delivery days', () => {
    render(<ShippingOptions options={mockOptions} />);

    expect(screen.getByText(/5-7 business days/i)).toBeInTheDocument();
    expect(screen.getByText(/2-3 business days/i)).toBeInTheDocument();
    expect(screen.getByText(/same day/i)).toBeInTheDocument();
  });

  it('displays "Free" for zero price options', () => {
    render(<ShippingOptions options={mockOptions} />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('renders location when provided', () => {
    render(<ShippingOptions options={mockOptions} location="New York, NY" />);
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
  });

  it('does not render location when not provided', () => {
    render(<ShippingOptions options={mockOptions} />);
    expect(screen.queryByText(/location/i)).not.toBeInTheDocument();
  });

  it('renders empty state when no options provided', () => {
    render(<ShippingOptions options={[]} />);
    expect(screen.getByText('No shipping options available')).toBeInTheDocument();
  });

  it('renders default icon when icon type is not specified', () => {
    const optionsWithoutIcon = [
      {
        id: '1',
        name: 'Default Shipping',
        price: 3.99,
        estimatedDays: '7-10 days',
      },
    ];
    render(<ShippingOptions options={optionsWithoutIcon} />);
    expect(screen.getByText('Default Shipping')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <ShippingOptions options={mockOptions} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards ref to div element', () => {
    const ref = { current: null };
    render(<ShippingOptions options={mockOptions} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
