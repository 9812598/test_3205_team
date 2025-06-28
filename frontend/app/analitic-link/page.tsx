"use client";

import { useActionState } from "react";
import { getAnalytics } from "./actions";

export default function AnaliticLink() {
  const [state, formAction, isPending] = useActionState(getAnalytics, {
    success: false,
    message: "",
    data: null,
    errors: {},
  });

  return (
    <div className="container">
      <main>
        <h1 className="title">Analytics</h1>

        {state.success && state.data && (
          <div className="successCard">
            <div className="cardHeader">Analytics Data</div>
            <div className="analyticsGrid">
              <div className="statCard">
                <div className="statNumber">{state.data.clickCount}</div>
                <div className="statLabel">Total Clicks</div>
              </div>
            </div>

            {state.data.lastIps.length > 0 && (
              <div className="infoCard">
                <div className="cardHeader">Last 5 IP Addresses</div>
                <ul className="ipList">
                  {state.data.lastIps.map((ip: string, index: number) => (
                    <li key={index} className="ipItem">
                      {ip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
              {isPending ? "Loading..." : "Get Analytics"}
            </button>
          </fieldset>
        </form>
      </main>
    </div>
  );
}
