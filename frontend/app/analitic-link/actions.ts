"use server";

import { z } from "zod";

const AnalyticsSchema = z.object({
  url: z.string().min(1, "URL or alias is required"),
});

type AnalyticsData = {
  clickCount: number;
  lastIps: string[];
};

type FormState = {
  success: boolean;
  message: string;
  data: AnalyticsData | null;
  errors: Record<string, string>;
};

export async function getAnalytics(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    url: formData.get("url") as string,
  };

  const validationResult = AnalyticsSchema.safeParse(rawData);

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

    const response = await fetch(`${backBaseUrl}/analytics/${alias}`);
    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: "Analytics data retrieved successfully",
        data: {
          clickCount: data.clickCount,
          lastIps: data.lastIps,
        },
        errors: {},
      };
    } else {
      return {
        success: false,
        message: data.message || "An error occurred while fetching analytics",
        data: null,
        errors: {},
      };
    }
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
      data: null,
      errors: {},
    };
  }
}
