import { render, screen } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { FilterChip, FilterChipGroup } from './FilterChip';

describe('FilterChip', () => {
  it('renders label text', () => {
    render(<FilterChip label="Size: M" />);
    expect(screen.getByText('Size: M')).toBeInTheDocument();
  });

  it('calls onRemove when remove button clicked', async () => {
    const user = userEvent.setup();
    const handleRemove = jest.fn();
    render(<FilterChip label="Brand: Zara" onRemove={handleRemove} />);

    const removeButton = screen.getByRole('button');
    await user.click(removeButton);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('shows active state', () => {
    render(<FilterChip label="Active Filter" active />);
    expect(screen.getByText('Active Filter')).toBeInTheDocument();
  });

  it('shows inactive state', () => {
    render(<FilterChip label="Inactive Filter" active={false} />);
    expect(screen.getByText('Inactive Filter')).toBeInTheDocument();
  });
});

describe('FilterChipGroup', () => {
  it('renders children chips', () => {
    render(
      <FilterChipGroup>
        <FilterChip label="Filter 1" />
        <FilterChip label="Filter 2" />
      </FilterChipGroup>
    );
    expect(screen.getByText('Filter 1')).toBeInTheDocument();
    expect(screen.getByText('Filter 2')).toBeInTheDocument();
  });

  it('shows clear all button', () => {
    render(
      <FilterChipGroup onClearAll={jest.fn()}>
        <FilterChip label="Filter 1" />
      </FilterChipGroup>
    );
    expect(screen.getByText('Obriši sve')).toBeInTheDocument();
  });

  it('calls onClearAll when clear button clicked', async () => {
    const user = userEvent.setup();
    const handleClearAll = jest.fn();
    render(
      <FilterChipGroup onClearAll={handleClearAll}>
        <FilterChip label="Filter 1" />
      </FilterChipGroup>
    );

    await user.click(screen.getByText('Obriši sve'));
    expect(handleClearAll).toHaveBeenCalledTimes(1);
  });
});
