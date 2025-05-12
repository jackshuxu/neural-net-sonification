import React from "react";

export default function ActivationDisplay({ hidden2 = [], output = [] }) {
  return (
    <div
      style={{
        padding: "1rem",
        background: "#1a1a1a",
        color: "#d0f0c0",
        fontFamily: "monospace",
        borderRadius: "8px",
        marginTop: "1rem",
      }}
    >
      <h4 style={{ marginBottom: "0.5rem" }}>Hidden2 Activations</h4>
      <pre style={{ maxHeight: "150px", overflowY: "auto" }}>
        {JSON.stringify(hidden2, null, 2)}
      </pre>
      <h4 style={{ margin: "1rem 0 0.5rem" }}>Output Activations</h4>
      <pre style={{ maxHeight: "150px", overflowY: "auto" }}>
        {JSON.stringify(output, null, 2)}
      </pre>
    </div>
  );
}
