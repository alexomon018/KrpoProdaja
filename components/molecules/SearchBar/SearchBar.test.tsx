import { render, screen, waitFor } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('renders search input', () => {
    render(<SearchBar />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('shows placeholder text', () => {
    render(<SearchBar placeholder="Search products..." />);
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'test query');
    expect(input).toHaveValue('test query');
  });

  it('calls onSearch when Enter is pressed', async () => {
    const user = userEvent.setup();
    const handleSearch = jest.fn();
    render(<SearchBar onSearch={handleSearch} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'search term{Enter}');

    expect(handleSearch).toHaveBeenCalledWith('search term');
  });

  it('shows clear button when input has value', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'test');
    expect(screen.getByRole('button', { name: /obriši/i })).toBeInTheDocument();
  });

  it('clears input when clear button clicked', async () => {
    const user = userEvent.setup();
    const handleClear = jest.fn();
    render(<SearchBar onClear={handleClear} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'test');
    await user.click(screen.getByRole('button', { name: /obriši/i }));

    expect(input).toHaveValue('');
    expect(handleClear).toHaveBeenCalled();
  });

  it('shows suggestions when typing', async () => {
    const user = userEvent.setup();
    const suggestions = ['Jakna', 'Jakne za zimu', 'Jakne Zara'];
    render(<SearchBar suggestions={suggestions} showSuggestions />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Jak');

    await waitFor(() => {
      expect(screen.getByText('Jakna')).toBeInTheDocument();
    });
  });
});
