import { render, screen } from "@/__tests__/utils/test-utils";
import { ReviewHighlights } from "./ReviewHighlights";

describe("ReviewHighlights", () => {
  it("renders all highlights correctly", () => {
    const highlights = ["Fast delivery", "Beautiful", "Great design"];
    render(<ReviewHighlights highlights={highlights} />);

    expect(screen.getByText("Fast delivery")).toBeInTheDocument();
    expect(screen.getByText("Beautiful")).toBeInTheDocument();
    expect(screen.getByText("Great design")).toBeInTheDocument();
  });

  it("renders the AI summary label", () => {
    render(<ReviewHighlights highlights={["Test"]} />);

    expect(screen.getByText("Buyer highlights, summarised by AI")).toBeInTheDocument();
  });

  it("renders nothing when highlights array is empty", () => {
    const { container } = render(<ReviewHighlights highlights={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ReviewHighlights highlights={["Test"]} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });
});
