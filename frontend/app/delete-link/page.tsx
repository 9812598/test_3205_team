"use client";

import { useActionState } from "react";
import { deleteShortLink } from "./actions";

export default function DeleteLink() {
  const [state, formAction, isPending] = useActionState(deleteShortLink, {
    success: false,
    message: "",
    errors: {},
  });

  return (
    <div className="container">
      <main>
        <h1 className="title">Delete Short Link</h1>

        {state.success && (
          <div className="successCard">
            <div className="cardHeader">Success!</div>
            <p className="cardText">{state.message}</p>
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
              <span className="labelText">Short URL or Alias *</span>
              <input
                type="text"
                name="url"
                placeholder="bRGpNe or http://localhost:3000/bRGpNe"
                required
                className="input"
                aria-invalid={state.errors?.url ? "true" : "false"}
              />
              <span className="helpText">
                Enter the short URL or just the alias
              </span>
              {state.errors?.url && (
                <span className="errorText">{state.errors.url}</span>
              )}
            </label>

            <button
              type="submit"
              disabled={isPending}
              aria-busy={isPending}
              className="deleteButton"
            >
              {isPending ? "Deleting..." : "Delete Short Link"}
            </button>
          </fieldset>
        </form>
      </main>
    </div>
  );
}
