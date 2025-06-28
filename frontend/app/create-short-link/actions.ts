"use server";

import { z } from "zod";

// URL validation regex
const URL_REGEX =
  /^https?:\/\/(?:[-\w.])+(?::[0-9]+)?(?:\/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:#(?:[\w.])*)?)?$/;

const CreateShortLinkSchema = z.object({
  originalUrl: z
    .string()
    .min(1, "Original URL is required")
    .regex(
      URL_REGEX,
      "Please enter a valid URL (must start with http:// or https://)"
    ),
  alias: z
    .string()
    .max(20, "Alias must be 20 characters or less")
    .optional()
    .or(z.literal("")),
  expiresAt: z.string().optional().or(z.literal("")),
});

type FormState = {
  success: boolean;
  message: string;
  shortUrl: string;
  errors: Record<string, string>;
};

export async function createShortLink(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    originalUrl: formData.get("originalUrl") as string,
    alias: formData.get("alias") as string,
    expiresAt: formData.get("expiresAt") as string,
  };

  // Validate with Zod
  const validationResult = CreateShortLinkSchema.safeParse(rawData);

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
      shortUrl: "",
      errors,
    };
  }

  const { originalUrl, alias, expiresAt } = validationResult.data;

  try {
    const backBaseUrl = process.env.BACK_BASE_URL || "http://localhost:3000";

    // Prepare request body
    const requestBody: any = {
      originalUrl,
    };

    if (alias && alias.trim()) {
      requestBody.alias = alias.trim();
    }

    if (expiresAt && expiresAt.trim()) {
      requestBody.expiresAt = expiresAt;
    }

    const response = await fetch(`${backBaseUrl}/shorten`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: "Short link created successfully!",
        shortUrl: data.shortUrl,
        errors: {},
      };
    } else {
      // Handle error responses
      return {
        success: false,
        message:
          data.message || "An error occurred while creating the short link",
        shortUrl: "",
        errors: {},
      };
    }
  } catch (error) {
    console.error("Error creating short link:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
      shortUrl: "",
      errors: {},
    };
  }
}
