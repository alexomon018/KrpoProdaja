import { render, screen, fireEvent } from "@/__tests__/utils/test-utils";
import { ReviewFilters } from "./ReviewFilters";

const mockFilters = [
  { id: "all", label: "All", count: 10 },
  { id: "appearance", label: "Appearance", count: 3 },
  { id: "delivery-packaging", label: "Delivery & Packaging", count: 4 },
];

describe("ReviewFilters", () => {
  it("renders all filter buttons", () => {
    const onFilterChange = jest.fn();
    const onSortChange = jest.fn();

    render(
      <ReviewFilters
        filters={mockFilters}
        selectedFilter="all"
        onFilterChange={onFilterChange}
        sortBy="suggested"
        onSortChange={onSortChange}
      />
    );

    expect(screen.getByText("All (10)")).toBeInTheDocument();
    expect(screen.getByText("Appearance (3)")).toBeInTheDocument();
    expect(screen.getByText("Delivery & Packaging (4)")).toBeInTheDocument();
  });

  it("highlights the selected filter", () => {
    const onFilterChange = jest.fn();
    const onSortChange = jest.fn();

    render(
      <ReviewFilters
        filters={mockFilters}
        selectedFilter="appearance"
        onFilterChange={onFilterChange}
        sortBy="suggested"
        onSortChange={onSortChange}
      />
    );

    const appearanceButton = screen.getByText("Appearance (3)");
    expect(appearanceButton).toHaveClass("bg-primary");
  });

  it("calls onFilterChange when filter button is clicked", () => {
    const onFilterChange = jest.fn();
    const onSortChange = jest.fn();

    render(
      <ReviewFilters
        filters={mockFilters}
        selectedFilter="all"
        onFilterChange={onFilterChange}
        sortBy="suggested"
        onSortChange={onSortChange}
      />
    );

    fireEvent.click(screen.getByText("Appearance (3)"));
    expect(onFilterChange).toHaveBeenCalledWith("appearance");
  });

  it("renders sort dropdown with current value", () => {
    const onFilterChange = jest.fn();
    const onSortChange = jest.fn();

    render(
      <ReviewFilters
        filters={mockFilters}
        selectedFilter="all"
        onFilterChange={onFilterChange}
        sortBy="newest"
        onSortChange={onSortChange}
      />
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("newest");
  });

  it("calls onSortChange when sort option is changed", () => {
    const onFilterChange = jest.fn();
    const onSortChange = jest.fn();

    render(
      <ReviewFilters
        filters={mockFilters}
        selectedFilter="all"
        onFilterChange={onFilterChange}
        sortBy="suggested"
        onSortChange={onSortChange}
      />
    );

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "oldest" } });
    expect(onSortChange).toHaveBeenCalledWith("oldest");
  });

  it("applies custom className", () => {
    const onFilterChange = jest.fn();
    const onSortChange = jest.fn();

    const { container } = render(
      <ReviewFilters
        filters={mockFilters}
        selectedFilter="all"
        onFilterChange={onFilterChange}
        sortBy="suggested"
        onSortChange={onSortChange}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });
});
