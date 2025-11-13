import { render, screen } from "@/__tests__/utils/test-utils";
import { ReviewSummary } from "./ReviewSummary";
import type { ReviewSummaryType } from "@/lib/types";

const mockSummary: ReviewSummaryType = {
  averageRating: 5.0,
  totalReviews: 5,
  ratingBreakdown: {
    itemQuality: 5.0,
    delivery: 5.0,
    customerService: 5.0,
  },
  recommendationPercentage: 100,
  highlights: ["Fast delivery", "Beautiful", "Unique"],
};

describe("ReviewSummary", () => {
  it("renders average rating correctly", () => {
    render(<ReviewSummary summary={mockSummary} />);

    const allRatings = screen.getAllByText("5.0");
    expect(allRatings.length).toBeGreaterThan(0);
    expect(screen.getByText(/item average/)).toBeInTheDocument();
  });

  it("renders rating breakdown metrics", () => {
    render(<ReviewSummary summary={mockSummary} />);

    expect(screen.getByText("Item quality")).toBeInTheDocument();
    expect(screen.getByText("Delivery")).toBeInTheDocument();
    expect(screen.getByText("Customer service")).toBeInTheDocument();
  });

  it("renders recommendation percentage", () => {
    render(<ReviewSummary summary={mockSummary} />);

    expect(screen.getByText("100%")).toBeInTheDocument();
    expect(screen.getByText(/Buyers.*recommend/)).toBeInTheDocument();
  });

  it("renders buyer highlights when present", () => {
    render(<ReviewSummary summary={mockSummary} />);

    expect(screen.getByText("Fast delivery")).toBeInTheDocument();
    expect(screen.getByText("Beautiful")).toBeInTheDocument();
    expect(screen.getByText("Unique")).toBeInTheDocument();
  });

  it("does not render highlights section when empty", () => {
    const summaryWithoutHighlights = {
      ...mockSummary,
      highlights: [],
    };

    render(<ReviewSummary summary={summaryWithoutHighlights} />);

    expect(screen.queryByText("Buyer highlights, summarised by AI")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ReviewSummary summary={mockSummary} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });
});
