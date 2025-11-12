import { render, screen } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { FilterPanel } from './FilterPanel';

describe('FilterPanel', () => {
  const mockFilters = {
    categories: [],
    priceMin: undefined,
    priceMax: undefined,
    sizes: [],
    brands: [],
    conditions: [],
    colors: [],
  };

  it('renders filter sections', () => {
    render(<FilterPanel filters={mockFilters} onFiltersChange={jest.fn()} />);
    expect(screen.getByText('Cena')).toBeInTheDocument();
    expect(screen.getByText('Veličina')).toBeInTheDocument();
    expect(screen.getByText('Brend')).toBeInTheDocument();
    expect(screen.getByText('Stanje')).toBeInTheDocument();
  });

  it('renders price inputs', () => {
    render(<FilterPanel filters={mockFilters} onFiltersChange={jest.fn()} />);
    expect(screen.getByPlaceholderText('Min (RSD)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max (RSD)')).toBeInTheDocument();
  });

  it('renders size buttons', () => {
    render(<FilterPanel filters={mockFilters} onFiltersChange={jest.fn()} />);
    expect(screen.getByText('XS')).toBeInTheDocument();
    expect(screen.getByText('S')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();
    expect(screen.getByText('L')).toBeInTheDocument();
  });

  it('calls onFiltersChange when size is selected', async () => {
    const user = userEvent.setup();
    const handleFiltersChange = jest.fn();
    render(<FilterPanel filters={mockFilters} onFiltersChange={handleFiltersChange} />);

    await user.click(screen.getByText('M'));
    expect(handleFiltersChange).toHaveBeenCalled();
  });

  it('renders brand checkboxes', () => {
    render(<FilterPanel filters={mockFilters} onFiltersChange={jest.fn()} />);
    expect(screen.getByLabelText('Zara')).toBeInTheDocument();
    expect(screen.getByLabelText('H&M')).toBeInTheDocument();
  });

  it('calls onFiltersChange when brand is selected', async () => {
    const user = userEvent.setup();
    const handleFiltersChange = jest.fn();
    render(<FilterPanel filters={mockFilters} onFiltersChange={handleFiltersChange} />);

    await user.click(screen.getByLabelText('Zara'));
    expect(handleFiltersChange).toHaveBeenCalled();
  });

  it('renders in mobile mode', () => {
    render(
      <FilterPanel
        filters={mockFilters}
        onFiltersChange={jest.fn()}
        mobile
        isOpen
        onClose={jest.fn()}
      />
    );
    expect(screen.getByText('Filteri')).toBeInTheDocument();
  });
});
