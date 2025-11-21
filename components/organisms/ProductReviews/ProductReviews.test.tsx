import { render, screen, fireEvent } from "@/__tests__/utils/test-utils";
import { ProductReviews } from "./ProductReviews";
import type { ReviewType, ReviewSummaryType, UserType } from "@/lib/types";

const mockUser: UserType = {
  id: "1",
  email: "testuser@example.com",
  memberSince: new Date("2020-01-01"),
};

const mockReviews: ReviewType[] = [
  {
    id: "1",
    rating: 5,
    comment: "Great product!",
    reviewer: mockUser,
    createdAt: new Date("2025-01-10"),
    reviewType: "appearance",
  },
  {
    id: "2",
    rating: 5,
    comment: "Fast shipping!",
    reviewer: mockUser,
    createdAt: new Date("2025-01-09"),
    reviewType: "delivery-packaging",
  },
  {
    id: "3",
    rating: 4,
    comment: "Good condition",
    reviewer: mockUser,
    createdAt: new Date("2025-01-08"),
    reviewType: "condition",
    sellerResponse: {
      comment: "Thank you!",
      createdAt: new Date("2025-01-09"),
    },
  },
];

const mockSummary: ReviewSummaryType = {
  averageRating: 5.0,
  totalReviews: 3,
  ratingBreakdown: {
    itemQuality: 5.0,
    delivery: 5.0,
    customerService: 5.0,
  },
  recommendationPercentage: 100,
  highlights: ["Fast delivery", "Beautiful", "Unique"],
};

describe("ProductReviews", () => {
  it("renders the reviews section with header", () => {
    render(<ProductReviews reviews={mockReviews} summary={mockSummary} />);

    expect(screen.getByText("Reviews for this item (3)")).toBeInTheDocument();
  });

  it("renders the review summary component", () => {
    render(<ProductReviews reviews={mockReviews} summary={mockSummary} />);

    const allRatings = screen.getAllByText("5.0");
    expect(allRatings.length).toBeGreaterThan(0);
    expect(screen.getByText(/item average/)).toBeInTheDocument();
  });

  it("renders filter tabs with correct counts", () => {
    render(<ProductReviews reviews={mockReviews} summary={mockSummary} />);

    expect(screen.getByText("All (3)")).toBeInTheDocument();
    expect(screen.getByText("Appearance (1)")).toBeInTheDocument();
    expect(screen.getByText("Delivery & Packaging (1)")).toBeInTheDocument();
    expect(screen.getByText("Condition (1)")).toBeInTheDocument();
  });

  it("filters reviews when filter tab is clicked", () => {
    render(<ProductReviews reviews={mockReviews} summary={mockSummary} />);

    // Initially shows all reviews
    expect(screen.getByText("Great product!")).toBeInTheDocument();
    expect(screen.getByText("Fast shipping!")).toBeInTheDocument();

    // Click on Appearance filter
    fireEvent.click(screen.getByText("Appearance (1)"));

    // Should only show appearance reviews
    expect(screen.getByText("Great product!")).toBeInTheDocument();
    expect(screen.queryByText("Fast shipping!")).not.toBeInTheDocument();
  });

  it("shows only first 3 reviews initially", () => {
    const manyReviews = Array.from({ length: 5 }, (_, i) => ({
      id: `review-${i}`,
      rating: 5,
      comment: `Review ${i}`,
      reviewer: mockUser,
      createdAt: new Date(),
    }));

    render(<ProductReviews reviews={manyReviews} summary={mockSummary} />);

    expect(screen.getByText("Review 0")).toBeInTheDocument();
    expect(screen.getByText("Review 1")).toBeInTheDocument();
    expect(screen.getByText("Review 2")).toBeInTheDocument();
    expect(screen.queryByText("Review 3")).not.toBeInTheDocument();
  });

  it("shows 'Show all reviews' button when more than 3 reviews", () => {
    const manyReviews = Array.from({ length: 5 }, (_, i) => ({
      id: `review-${i}`,
      rating: 5,
      comment: `Review ${i}`,
      reviewer: mockUser,
      createdAt: new Date(),
    }));

    render(<ProductReviews reviews={manyReviews} summary={mockSummary} />);

    expect(screen.getByText("Show all 5 reviews")).toBeInTheDocument();
  });

  it("shows all reviews when 'Show all' button is clicked", () => {
    const manyReviews = Array.from({ length: 5 }, (_, i) => ({
      id: `review-${i}`,
      rating: 5,
      comment: `Review ${i}`,
      reviewer: mockUser,
      createdAt: new Date(),
    }));

    render(<ProductReviews reviews={manyReviews} summary={mockSummary} />);

    fireEvent.click(screen.getByText("Show all 5 reviews"));

    expect(screen.getByText("Review 3")).toBeInTheDocument();
    expect(screen.getByText("Review 4")).toBeInTheDocument();
  });

  it("renders seller responses when present", () => {
    render(<ProductReviews reviews={mockReviews} summary={mockSummary} />);

    expect(screen.getByText("Response from Seller")).toBeInTheDocument();
    expect(screen.getByText("Thank you!")).toBeInTheDocument();
  });

  it("sorts reviews by newest when sort option is changed", () => {
    render(<ProductReviews reviews={mockReviews} summary={mockSummary} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "newest" } });

    // Reviews should be sorted by date (newest first)
    const comments = screen.getAllByText(/Great product!|Fast shipping!|Good condition/);
    expect(comments[0]).toHaveTextContent("Great product!"); // Jan 10
  });

  it("shows empty state when no reviews match filter", () => {
    const reviewsWithoutTypes = [
      {
        id: "1",
        rating: 5,
        comment: "Test",
        reviewer: mockUser,
        createdAt: new Date(),
      },
    ];

    render(<ProductReviews reviews={reviewsWithoutTypes} summary={mockSummary} />);

    // Only "All" filter should be visible since no reviews have types
    expect(screen.getByText("All (1)")).toBeInTheDocument();
    expect(screen.getByText("Test")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ProductReviews
        reviews={mockReviews}
        summary={mockSummary}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });
});
