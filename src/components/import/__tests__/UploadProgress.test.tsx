import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { UploadProgress } from "../UploadProgress";

describe("UploadProgress", () => {
  it("should display progress statistics", () => {
    render(
      <UploadProgress
        totalRows={100}
        successCount={80}
        failCount={20}
        errors={[]}
        isComplete={false}
      />
    );
    
    expect(screen.getByText("80 / 100")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("should display errors when present", () => {
    const errors = [
      { row: 5, field: "amount", value: "abc", message: "금액은 숫자여야 합니다" },
      { row: 7, field: "date", value: "2024/01/01", message: "날짜 형식 오류" },
    ];

    render(
      <UploadProgress
        totalRows={10}
        successCount={8}
        failCount={2}
        errors={errors}
        isComplete={true}
      />
    );
    
    expect(screen.getByText(/오류 목록/)).toBeInTheDocument();
    expect(screen.getByText(/행 5:/)).toBeInTheDocument();
    expect(screen.getByText(/행 7:/)).toBeInTheDocument();
  });

  it("should show success message when complete with no errors", () => {
    render(
      <UploadProgress
        totalRows={100}
        successCount={100}
        failCount={0}
        errors={[]}
        isComplete={true}
      />
    );
    
    expect(screen.getByText(/성공적으로 업로드/)).toBeInTheDocument();
  });

  it("should not show success message when not complete", () => {
    render(
      <UploadProgress
        totalRows={100}
        successCount={50}
        failCount={0}
        errors={[]}
        isComplete={false}
      />
    );
    
    expect(screen.queryByText(/성공적으로 업로드/)).not.toBeInTheDocument();
  });
});

