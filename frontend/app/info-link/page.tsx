"use client";

import { useActionState } from "react";
import { getLinkInfo } from "./actions";

export default function InfoLink() {
  const [state, formAction, isPending] = useActionState(getLinkInfo, {
    success: false,
    message: "",
    data: null,
    errors: {},
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container">
      <main>
        <h1 className="title">Link Information</h1>

        {state.success && state.data && (
          <div className="successCard">
            <div className="cardHeader">Link Information</div>
            <div className="infoGrid">
              <div className="infoItem">
                <span className="infoLabel">Original URL:</span>
                <span className="infoValue">{state.data.originalUrl}</span>
              </div>
              <div className="infoItem">
                <span className="infoLabel">Created At:</span>
                <span className="infoValue">
                  {formatDate(state.data.createdAt)}
                </span>
              </div>
              <div className="infoItem">
                <span className="infoLabel">Click Count:</span>
                <span className="infoValue">{state.data.clickCount}</span>
              </div>
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
              <span className="labelText">Short URL or Alias *</span>
              <input
                type="text"
                name="url"
                placeholder="myalias2 or http://localhost:3000/myalias2"
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
              className="submitButton"
            >
              {isPending ? "Loading..." : "Get Information"}
            </button>
          </fieldset>
        </form>
      </main>
    </div>
  );
}
