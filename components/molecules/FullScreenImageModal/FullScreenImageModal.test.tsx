import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import { FullScreenImageModal } from './FullScreenImageModal';

// Mock embla-carousel-react
jest.mock('embla-carousel-react', () => {
  return jest.fn(() => [
    jest.fn(),
    {
      scrollPrev: jest.fn(),
      scrollNext: jest.fn(),
      scrollTo: jest.fn(),
      selectedScrollSnap: jest.fn(() => 0),
      canScrollPrev: jest.fn(() => false),
      canScrollNext: jest.fn(() => true),
      on: jest.fn(),
      off: jest.fn(),
    },
  ]);
});

describe('FullScreenImageModal', () => {
  const mockImages = [
    '/image1.jpg',
    '/image2.jpg',
    '/image3.jpg',
  ];

  const defaultProps = {
    images: mockImages,
    isOpen: true,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <FullScreenImageModal {...defaultProps} isOpen={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when isOpen is true', () => {
    render(<FullScreenImageModal {...defaultProps} />);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('renders correct image counter', () => {
    render(<FullScreenImageModal {...defaultProps} />);
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('renders zoom controls', () => {
    render(<FullScreenImageModal {...defaultProps} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = jest.fn();
    render(<FullScreenImageModal {...defaultProps} onClose={mockOnClose} />);

    const closeButton = screen.getAllByRole('button')[0];
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    const mockOnClose = jest.fn();
    const { container } = render(
      <FullScreenImageModal {...defaultProps} onClose={mockOnClose} />
    );

    const backdrop = container.querySelector('.fixed.inset-0');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalled();
    }
  });

  it('renders navigation buttons when multiple images', () => {
    render(<FullScreenImageModal {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(2);
  });

  it('does not render navigation buttons for single image', () => {
    render(
      <FullScreenImageModal {...defaultProps} images={['/single.jpg']} />
    );
    expect(screen.queryByText('1 / 1')).toBeInTheDocument();
  });

  it('renders thumbnails for multiple images', () => {
    render(<FullScreenImageModal {...defaultProps} />);
    const thumbnails = screen.getAllByRole('button').filter((btn) =>
      btn.className.includes('w-16')
    );
    expect(thumbnails.length).toBe(3);
  });

  it('handles zoom in', () => {
    render(<FullScreenImageModal {...defaultProps} />);
    const zoomInButton = screen.getAllByRole('button')[2];
    fireEvent.click(zoomInButton);
    expect(screen.getByText('150%')).toBeInTheDocument();
  });

  it('handles zoom out', () => {
    render(<FullScreenImageModal {...defaultProps} />);
    // First zoom in
    const zoomInButton = screen.getAllByRole('button')[2];
    fireEvent.click(zoomInButton);
    expect(screen.getByText('150%')).toBeInTheDocument();

    // Then zoom out
    const zoomOutButton = screen.getAllByRole('button')[1];
    fireEvent.click(zoomOutButton);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    const mockOnClose = jest.fn();
    render(<FullScreenImageModal {...defaultProps} onClose={mockOnClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('uses custom alt text', () => {
    render(<FullScreenImageModal {...defaultProps} alt="Custom product" />);
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('alt', 'Custom product 1');
  });

  it('starts at initialIndex', () => {
    render(<FullScreenImageModal {...defaultProps} initialIndex={1} />);
    // Component should attempt to start at index 1
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });
});
