import { render, screen } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { Header } from './Header';

describe('Header', () => {
  it('renders logo/brand', () => {
    render(<Header />);
    expect(screen.getByText('KP')).toBeInTheDocument();
  });

  it('renders search bar when showSearch is true', () => {
    render(<Header showSearch />);
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(0);
  });

  it('hides search bar when showSearch is false', () => {
    render(<Header showSearch={false} />);
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('calls onSearch when search is performed', async () => {
    const user = userEvent.setup();
    const handleSearch = jest.fn();
    render(<Header showSearch onSearch={handleSearch} />);

    const inputs = screen.getAllByRole('textbox');
    await user.type(inputs[0], 'test query{Enter}');

    expect(handleSearch).toHaveBeenCalledWith('test query');
  });

  it('calls onFilterClick when filter button clicked', async () => {
    const user = userEvent.setup();
    const handleFilterClick = jest.fn();
    render(<Header onFilterClick={handleFilterClick} />);

    const filterButton = screen.getByRole('button', { name: /filter/i });
    await user.click(filterButton);

    expect(handleFilterClick).toHaveBeenCalledTimes(1);
  });

  it('shows user avatar when user is provided', () => {
    const user = { email: 'testuser@example.com', avatar: '/avatar.jpg' };
    render(<Header user={user} />);
    expect(screen.getByRole('img', { name: /testuser/i })).toBeInTheDocument();
  });

  it('renders header element', () => {
    render(<Header />);
    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  it('renders with notification count', () => {
    render(<Header notificationCount={3} />);
    // Header should render successfully with notification count
    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
  });
});
