"use server";

import { z } from "zod";

const InfoSchema = z.object({
  url: z.string().min(1, "URL or alias is required"),
});

type LinkInfo = {
  originalUrl: string;
  createdAt: string;
  clickCount: number;
};

type FormState = {
  success: boolean;
  message: string;
  data: LinkInfo | null;
  errors: Record<string, string>;
};

export async function getLinkInfo(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    url: formData.get("url") as string,
  };

  const validationResult = InfoSchema.safeParse(rawData);

  if (!validationResult.success) {
    const errors: Record<string, string> = {};
    validationResult.error.errors.forEach((error) => {
      if (error.path[0]) {
        errors[error.path[0] as string] = error.message;
      }
    });

    return {
      success: false,
      message: "Please fix the validation errors",
      data: null,
      errors,
    };
  }

  const { url } = validationResult.data;

  try {
    const backBaseUrl = process.env.BACK_BASE_URL || "http://localhost:3000";

    // Extract alias from URL if full URL is provided
    let alias = url;
    if (url.includes("/")) {
      alias = url.split("/").pop() || url;
    }

    const response = await fetch(`${backBaseUrl}/info/${alias}`);
    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: "Link information retrieved successfully",
        data: {
          originalUrl: data.originalUrl,
          createdAt: data.createdAt,
          clickCount: data.clickCount,
        },
        errors: {},
      };
    } else {
      return {
        success: false,
        message:
          data.message || "An error occurred while fetching link information",
        data: null,
        errors: {},
      };
    }
  } catch (error) {
    console.error("Error fetching link info:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
      data: null,
      errors: {},
    };
  }
}
