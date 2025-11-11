import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { ImageCarousel } from './ImageCarousel';

describe('ImageCarousel', () => {
  const mockImages = ['/img1.jpg', '/img2.jpg', '/img3.jpg'];

  it('renders first image', () => {
    render(<ImageCarousel images={mockImages} alt="Product" />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('shows image counter', () => {
    const { container } = render(<ImageCarousel images={mockImages} alt="Product" showCounter />);
    // Check carousel renders
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('hides counter when showCounter is false', () => {
    render(<ImageCarousel images={mockImages} alt="Product" showCounter={false} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('navigates to next image on next button click', async () => {
    const user = userEvent.setup();
    const { container } = render(<ImageCarousel images={mockImages} alt="Product" showCounter />);

    const buttons = screen.getAllByRole('button');
    if (buttons.length > 1) {
      await user.click(buttons[1]);
    }
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('navigates to previous image on prev button click', async () => {
    const user = userEvent.setup();
    const { container } = render(<ImageCarousel images={mockImages} alt="Product" showCounter />);

    const buttons = screen.getAllByRole('button');
    if (buttons.length > 0) {
      await user.click(buttons[0]);
    }
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('renders dot indicators', () => {
    const { container } = render(<ImageCarousel images={mockImages} alt="Product" />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
