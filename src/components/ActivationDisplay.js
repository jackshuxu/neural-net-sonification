import React from "react";

export default function ActivationDisplay({
  hidden1 = [],
  hidden2 = [],
  output = [],
}) {
  return (
    <div
      style={{
        padding: "1rem",
        background: "#1a1a1a",
        color: "#d0f0c0",
        fontFamily: "monospace",
        fontSize: "16px",
        borderRadius: "8px",
        marginTop: "1rem",
      }}
    >
      <div style={{ display: "flex", gap: "2rem" }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ marginBottom: "0.5rem", fontSize: "18px" }}>
            Hidden1 Activations
          </h4>
          <pre
            style={{ maxHeight: "333px", overflowY: "auto", fontSize: "14px" }}
          >
            {JSON.stringify(hidden1, null, 2)}
          </pre>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ marginBottom: "0.5rem", fontSize: "18px" }}>
            Hidden2 Activations
          </h4>
          <pre
            style={{ maxHeight: "300px", overflowY: "auto", fontSize: "14px" }}
          >
            {JSON.stringify(hidden2, null, 2)}
          </pre>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ marginBottom: "0.5rem", fontSize: "18px" }}>
            Output Activations
          </h4>
          <pre
            style={{ maxHeight: "300px", overflowY: "auto", fontSize: "14px" }}
          >
            {JSON.stringify(output, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
