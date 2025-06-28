"use server";

import { z } from "zod";

const DeleteLinkSchema = z.object({
  url: z.string().min(1, "URL or alias is required"),
});

type FormState = {
  success: boolean;
  message: string;
  errors: Record<string, string>;
};

export async function deleteShortLink(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    url: formData.get("url") as string,
  };

  const validationResult = DeleteLinkSchema.safeParse(rawData);

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

    const response = await fetch(`${backBaseUrl}/delete/${alias}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || "Short URL deleted successfully",
        errors: {},
      };
    } else {
      return {
        success: false,
        message:
          data.message || "An error occurred while deleting the short link",
        errors: {},
      };
    }
  } catch (error) {
    console.error("Error deleting short link:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
      errors: {},
    };
  }
}
