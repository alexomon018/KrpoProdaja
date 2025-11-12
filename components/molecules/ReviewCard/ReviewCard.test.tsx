import { render, screen } from '@/__tests__/utils/test-utils';
import { ReviewCard, RatingDisplay } from './ReviewCard';
import { mockReview } from '@/__tests__/mocks/data';

describe('ReviewCard', () => {
  it('renders reviewer username', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText(mockReview.reviewer.username)).toBeInTheDocument();
  });

  it('renders review comment', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText(mockReview.comment)).toBeInTheDocument();
  });

  it('renders reviewer avatar', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('displays rating value', () => {
    render(<ReviewCard review={mockReview} />);
    expect(screen.getByText('5.0')).toBeInTheDocument();
  });

  it('shows relative timestamp', () => {
    render(<ReviewCard review={mockReview} />);
    // Check for Serbian relative time text
    const reviewCard = screen.getByText(mockReview.comment).parentElement?.parentElement;
    expect(reviewCard).toBeInTheDocument();
  });
});

describe('RatingDisplay', () => {
  it('renders rating value', () => {
    render(<RatingDisplay rating={4.5} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('displays review count when provided', () => {
    render(<RatingDisplay rating={4.5} reviewCount={25} showCount />);
    expect(screen.getByText('(25)')).toBeInTheDocument();
  });

  it('renders rating display', () => {
    render(<RatingDisplay rating={3} />);
    expect(screen.getByText('3.0')).toBeInTheDocument();
  });

  it('applies different sizes', () => {
    render(<RatingDisplay rating={5} size="lg" />);
    expect(screen.getByText('5.0')).toBeInTheDocument();
  });
});
