import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KpiCard } from "../KpiCard";
import { TrendingUp } from "lucide-react";

describe("KpiCard", () => {
  it("should render title and value", () => {
    render(<KpiCard title="Test KPI" value="₩1,000,000" />);
    
    expect(screen.getByText("Test KPI")).toBeInTheDocument();
    expect(screen.getByText("₩1,000,000")).toBeInTheDocument();
  });

  it("should render subtitle when provided", () => {
    render(
      <KpiCard
        title="Test KPI"
        value="100"
        subtitle="Last 12 months"
      />
    );
    
    expect(screen.getByText("Last 12 months")).toBeInTheDocument();
  });

  it("should render icon when provided", () => {
    const { container } = render(
      <KpiCard
        title="Test KPI"
        value="100"
        icon={TrendingUp}
      />
    );
    
    // Icon should be rendered (check for svg element)
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("should render trend information", () => {
    render(
      <KpiCard
        title="Test KPI"
        value="100"
        trend={{ value: 15, label: "vs last month", isPositive: true }}
      />
    );
    
    expect(screen.getByText("+15%")).toBeInTheDocument();
    expect(screen.getByText("vs last month")).toBeInTheDocument();
  });

  it("should show negative trend", () => {
    render(
      <KpiCard
        title="Test KPI"
        value="100"
        trend={{ value: -10, label: "vs last month", isPositive: false }}
      />
    );
    
    expect(screen.getByText("-10%")).toBeInTheDocument();
  });
});

