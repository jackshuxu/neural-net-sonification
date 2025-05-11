import React from "react";
import ActivationGrid from "./ActivationGrid";

export default function NetworkVis({ acts, error }) {
  if (error) {
    return <div style={{ color: "salmon" }}>Error: {error}</div>;
  }
  if (!acts) {
    return <div style={{ color: "#eee" }}>Computing network activations…</div>;
  }

  const { input, hidden1, hidden2, output } = acts;

  // Flat → N×N helper
  const to2d = (arr) => {
    const n = Math.ceil(Math.sqrt(arr.length));
    const mat = Array.from({ length: n }, () => Array(n).fill(0));
    arr.forEach((v, i) => {
      mat[Math.floor(i / n)][i % n] = v;
    });
    return mat;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 48,
        overflowX: "auto",
      }}
    >
      {/* Input */}
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "#eee", marginBottom: 8 }}>Input</div>
        <ActivationGrid data={input} cellSize={8} />
      </div>

      {/* Hidden 1 */}
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "#eee", marginBottom: 8 }}>Hidden 1</div>
        <ActivationGrid data={to2d(hidden1)} cellSize={24} />
      </div>

      {/* Hidden 2 */}
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "#eee", marginBottom: 8 }}>Hidden 2</div>
        <ActivationGrid data={to2d(hidden2)} cellSize={32} />
      </div>

      {/* Output with annotation */}
      <div style={{ textAlign: "center" }}>
        <div style={{ color: "#eee", marginBottom: 8 }}>Output</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${output.length}, 1fr)`,
            gap: 4,
          }}
        >
          {output.map((val, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: `rgba(255,255,255,${Math.min(
                    Math.max(val, 0),
                    1
                  )})`,
                  border: "1px solid #666",
                  borderRadius: 4,
                }}
              />
              <div style={{ marginTop: 4, color: "#eee" }}>{idx}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
