import { render, screen } from "@/__tests__/utils/test-utils";
import { RatingMetric } from "./RatingMetric";

describe("RatingMetric", () => {
  it("renders the rating and label correctly", () => {
    render(<RatingMetric label="Item quality" rating={4.8} />);

    expect(screen.getByText("4.8")).toBeInTheDocument();
    expect(screen.getByText("Item quality")).toBeInTheDocument();
  });

  it("formats rating to one decimal place", () => {
    render(<RatingMetric label="Delivery" rating={5} />);

    expect(screen.getByText("5.0")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <RatingMetric label="Service" rating={4.5} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders different sizes correctly", () => {
    const { rerender, container } = render(
      <RatingMetric label="Test" rating={4.0} size="sm" />
    );
    const smallBadge = container.querySelector(".w-6");
    expect(smallBadge).toBeInTheDocument();

    rerender(<RatingMetric label="Test" rating={4.0} size="lg" />);
    const largeBadge = container.querySelector(".w-10");
    expect(largeBadge).toBeInTheDocument();
  });
});
