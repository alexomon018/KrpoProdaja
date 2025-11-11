import { render, screen } from '@/__tests__/utils/test-utils';
import { usePathname } from 'next/navigation';
import { BottomNavigation } from './BottomNavigation';

jest.mock('next/navigation');

describe('BottomNavigation', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  it('renders all navigation items', () => {
    render(<BottomNavigation />);
    expect(screen.getByText('Početna')).toBeInTheDocument();
    expect(screen.getByText('Pretraga')).toBeInTheDocument();
    expect(screen.getByText('Prodaj')).toBeInTheDocument();
    expect(screen.getByText('Poruke')).toBeInTheDocument();
    expect(screen.getByText('Profil')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<BottomNavigation />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(5);
  });

  it('highlights active route', () => {
    (usePathname as jest.Mock).mockReturnValue('/search');
    render(<BottomNavigation />);
    expect(screen.getByText('Pretraga')).toBeInTheDocument();
  });

  it('shows message count badge', () => {
    render(<BottomNavigation messageCount={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('shows 9+ for message counts over 9', () => {
    render(<BottomNavigation messageCount={15} />);
    expect(screen.getByText('9+')).toBeInTheDocument();
  });

  it('does not show badge when messageCount is 0', () => {
    render(<BottomNavigation messageCount={0} />);
    const badges = screen.queryByText(/^\d+$/);
    expect(badges).not.toBeInTheDocument();
  });

  it('contains correct navigation paths', () => {
    render(<BottomNavigation />);
    expect(screen.getByRole('link', { name: /početna/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /pretraga/i })).toHaveAttribute('href', '/search');
    expect(screen.getByRole('link', { name: /prodaj/i })).toHaveAttribute('href', '/sell');
    expect(screen.getByRole('link', { name: /poruke/i })).toHaveAttribute('href', '/messages');
    expect(screen.getByRole('link', { name: /profil/i })).toHaveAttribute('href', '/profile');
  });
});
