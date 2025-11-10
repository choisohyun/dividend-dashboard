import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "../empty-state";
import { Upload } from "lucide-react";

describe("EmptyState", () => {
  it("should render title and description", () => {
    render(
      <EmptyState
        title="No Data"
        description="Please upload a CSV file"
      />
    );
    
    expect(screen.getByText("No Data")).toBeInTheDocument();
    expect(screen.getByText("Please upload a CSV file")).toBeInTheDocument();
  });

  it("should render icon when provided", () => {
    const { container } = render(
      <EmptyState
        icon={Upload}
        title="No Data"
        description="Please upload a CSV file"
      />
    );
    
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should render action button when provided", () => {
    render(
      <EmptyState
        title="No Data"
        description="Please upload a CSV file"
        action={{ label: "Upload Now", href: "/import" }}
      />
    );
    
    const link = screen.getByRole("link", { name: "Upload Now" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/import");
  });

  it("should not render action button when not provided", () => {
    render(
      <EmptyState
        title="No Data"
        description="Please upload a CSV file"
      />
    );
    
    const link = screen.queryByRole("link");
    expect(link).not.toBeInTheDocument();
  });
});

