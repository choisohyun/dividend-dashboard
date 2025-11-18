import html2canvas from "html2canvas";

/**
 * Capture element as image and download
 */
export async function captureAndDownload(
  elementId: string,
  filename: string = "report.png"
): Promise<void> {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2, // Higher quality
      logging: false,
    });

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  } catch (error) {
    console.error("Screenshot error:", error);
    throw new Error("이미지 생성 실패");
  }
}

/**
 * Capture element as base64 data URL
 */
export async function captureAsDataUrl(elementId: string): Promise<string> {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
      logging: false,
    });

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Screenshot error:", error);
    throw new Error("이미지 생성 실패");
  }
}

/**
 * Capture element and copy to clipboard
 */
export async function captureToClipboard(elementId: string): Promise<void> {
  const element = document.getElementById(elementId);
  
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
      logging: false,
    });

    canvas.toBlob(async (blob) => {
      if (blob && navigator.clipboard && navigator.clipboard.write) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
        } catch (err) {
          throw new Error("클립보드 복사 실패");
        }
      }
    });
  } catch (error) {
    console.error("Screenshot error:", error);
    throw new Error("이미지 생성 실패");
  }
}

