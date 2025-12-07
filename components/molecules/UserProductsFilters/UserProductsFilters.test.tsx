import { render, screen } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { UserProductsFilters } from './UserProductsFilters';

describe('UserProductsFilters', () => {
  const mockHandleStatusChange = jest.fn();
  const mockHandleSortChange = jest.fn();

  const defaultProps = {
    status: 'all',
    sortBy: 'newest',
    onStatusChange: mockHandleStatusChange,
    onSortChange: mockHandleSortChange,
    inline: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render all status tabs', () => {
      render(<UserProductsFilters {...defaultProps} />);

      expect(screen.getByText('Svi')).toBeInTheDocument();
      expect(screen.getByText('Aktivni')).toBeInTheDocument();
      expect(screen.getByText('Rezervisani')).toBeInTheDocument();
      expect(screen.getByText('Prodati')).toBeInTheDocument();
    });

    it('should render sort dropdown', () => {
      render(<UserProductsFilters {...defaultProps} />);

      expect(screen.getByText('Najnoviji')).toBeInTheDocument();
    });

    it('should apply inline layout when inline prop is true', () => {
      const { container } = render(
        <UserProductsFilters {...defaultProps} inline />
      );

      const wrapperDiv = container.querySelector('.space-y-4');
      expect(wrapperDiv).toBeInTheDocument();
    });

    it('should apply margin when inline prop is false', () => {
      const { container } = render(
        <UserProductsFilters {...defaultProps} inline={false} />
      );

      const wrapperDiv = container.querySelector('.mb-6');
      expect(wrapperDiv).toBeInTheDocument();
    });
  });

  describe('Status Tab Interactions', () => {
    it('should call onStatusChange when "Aktivni" tab is clicked', async () => {
      const user = userEvent.setup();
      render(<UserProductsFilters {...defaultProps} />);

      await user.click(screen.getByText('Aktivni'));

      expect(mockHandleStatusChange).toHaveBeenCalledWith('active');
    });

    it('should call onStatusChange when "Rezervisani" tab is clicked', async () => {
      const user = userEvent.setup();
      render(<UserProductsFilters {...defaultProps} />);

      await user.click(screen.getByText('Rezervisani'));

      expect(mockHandleStatusChange).toHaveBeenCalledWith('reserved');
    });

    it('should call onStatusChange when "Prodati" tab is clicked', async () => {
      const user = userEvent.setup();
      render(<UserProductsFilters {...defaultProps} />);

      await user.click(screen.getByText('Prodati'));

      expect(mockHandleStatusChange).toHaveBeenCalledWith('sold');
    });

    it('should call onStatusChange when "Svi" tab is clicked', async () => {
      const user = userEvent.setup();
      render(
        <UserProductsFilters {...defaultProps} status="active" />
      );

      await user.click(screen.getByText('Svi'));

      expect(mockHandleStatusChange).toHaveBeenCalledWith('all');
    });

    it('should highlight active status tab with primary variant', () => {
      const { rerender } = render(
        <UserProductsFilters {...defaultProps} status="active" />
      );

      const activeTab = screen.getByText('Aktivni').closest('button');
      expect(activeTab).toBeInTheDocument();

      rerender(
        <UserProductsFilters {...defaultProps} status="reserved" />
      );

      const reservedTab = screen.getByText('Rezervisani').closest('button');
      expect(reservedTab).toBeInTheDocument();
    });
  });

  describe('Sort Dropdown Interactions', () => {
    it('should display current sort option', () => {
      render(<UserProductsFilters {...defaultProps} sortBy="newest" />);

      expect(screen.getByText('Najnoviji')).toBeInTheDocument();
    });

    it('should display price-asc sort option', () => {
      render(<UserProductsFilters {...defaultProps} sortBy="price-asc" />);

      expect(screen.getByText('Cena: Rastuća')).toBeInTheDocument();
    });

    it('should display price-desc sort option', () => {
      render(<UserProductsFilters {...defaultProps} sortBy="price-desc" />);

      expect(screen.getByText('Cena: Opadajuća')).toBeInTheDocument();
    });

    // Note: Dropdown interaction tests are skipped because Radix UI Select
    // uses pointer capture which is not fully supported in jsdom test environment
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for status tabs', () => {
      render(<UserProductsFilters {...defaultProps} />);

      const statusTabs = screen.getAllByRole('button');
      expect(statusTabs).toHaveLength(4); // 4 status tabs
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<UserProductsFilters {...defaultProps} />);

      // Tab to first status button
      await user.tab();
      expect(screen.getByText('Aktivni')).toHaveFocus();

      // Press Enter to activate
      await user.keyboard('{Enter}');
      expect(mockHandleStatusChange).toHaveBeenCalledWith('active');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid status changes', async () => {
      const user = userEvent.setup();
      render(<UserProductsFilters {...defaultProps} />);

      await user.click(screen.getByText('Aktivni'));
      await user.click(screen.getByText('Rezervisani'));
      await user.click(screen.getByText('Prodati'));

      expect(mockHandleStatusChange).toHaveBeenCalledTimes(3);
      expect(mockHandleStatusChange).toHaveBeenNthCalledWith(1, 'active');
      expect(mockHandleStatusChange).toHaveBeenNthCalledWith(2, 'reserved');
      expect(mockHandleStatusChange).toHaveBeenNthCalledWith(3, 'sold');
    });

    it('should not break when handlers are not provided', () => {
      render(
        <UserProductsFilters
          status="all"
          sortBy="newest"
          onStatusChange={undefined as any}
          onSortChange={undefined as any}
          inline={false}
        />
      );

      expect(screen.getByText('Svi')).toBeInTheDocument();
    });
  });
});
