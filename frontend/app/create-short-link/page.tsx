"use client";

import { useActionState } from "react";
import { createShortLink } from "./actions";

export default function CreateShortLink() {
  const [state, formAction, isPending] = useActionState(createShortLink, {
    success: false,
    message: "",
    shortUrl: "",
    errors: {},
  });

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        alert("Copied to clipboard!");
        return;
      }

      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (successful) {
        alert("Copied to clipboard!");
      } else {
        throw new Error("Copy command failed");
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
      prompt("Copy this URL manually:", text);
    }
  };

  return (
    <div className="container">
      <main>
        <h1 className="title">Create Short Link</h1>

        {state.success && state.shortUrl && (
          <div className="successCard">
            <div className="cardHeader">Success!</div>
            <p className="cardText">Your short URL has been created:</p>
            <div className="urlContainer">
              <input
                type="text"
                value={state.shortUrl}
                readOnly
                className="urlInput"
              />
              <button
                type="button"
                onClick={() => copyToClipboard(state.shortUrl)}
                className="copyButton"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {state.message && !state.success && (
          <div className="errorCard">
            <div className="cardHeader">Error</div>
            <p className="cardText">{state.message}</p>
          </div>
        )}

        <form action={formAction} className="form">
          <fieldset className="fieldset">
            <label className="label">
              <span className="labelText">Original URL *</span>
              <input
                type="url"
                name="originalUrl"
                placeholder="https://example.com"
                required
                className="input"
                aria-invalid={state.errors?.originalUrl ? "true" : "false"}
              />
              {state.errors?.originalUrl && (
                <span className="errorText">{state.errors.originalUrl}</span>
              )}
            </label>

            <label className="label">
              <span className="labelText">Custom Alias (optional)</span>
              <input
                type="text"
                name="alias"
                placeholder="my-custom-alias"
                maxLength={20}
                className="input"
                aria-invalid={state.errors?.alias ? "true" : "false"}
              />
              <span className="helpText">Maximum 20 characters</span>
              {state.errors?.alias && (
                <span className="errorText">{state.errors.alias}</span>
              )}
            </label>

            <label className="label">
              <span className="labelText">Expires At</span>
              <input
                type="date"
                name="expiresAt"
                className="input"
                aria-label="Date"
                aria-invalid={state.errors?.expiresAt ? "true" : "false"}
              />
              {state.errors?.expiresAt && (
                <span className="errorText">{state.errors.expiresAt}</span>
              )}
            </label>

            <button
              type="submit"
              disabled={isPending}
              aria-busy={isPending}
              className="submitButton"
            >
              {isPending ? "Creating..." : "Create Short Link"}
            </button>
          </fieldset>
        </form>
      </main>
    </div>
  );
}
