import React from "react";
import ActivationGrid from "./ActivationGrid";

export default function NetworkVis({ acts, error }) {
  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>;
  }
  if (!acts) {
    return <div style={{ color: "#fff" }}>Computing network activations…</div>;
  }

  const { input, hidden1, hidden2, output } = acts;
  function to2d(arr) {
    const size = Math.ceil(Math.sqrt(arr.length));
    const mat = Array.from({ length: size }, () => Array(size).fill(0));
    arr.forEach((v, i) => (mat[Math.floor(i / size)][i % size] = v));
    return mat;
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        background: "#222",
        padding: 20,
        overflowX: "auto",
      }}
    >
      <div>
        <div style={{ color: "#fff" }}>Input</div>
        <ActivationGrid data={input} cellSize={6} />
      </div>
      <div>
        <div style={{ color: "#fff" }}>Hidden 1</div>
        <ActivationGrid data={to2d(hidden1)} cellSize={20} />
      </div>
      <div>
        <div style={{ color: "#fff" }}>Hidden 2</div>
        <ActivationGrid data={to2d(hidden2)} cellSize={30} />
      </div>
      <div>
        <div style={{ color: "#fff" }}>Output</div>
        <ActivationGrid data={[output]} cellSize={40} />
      </div>
    </div>
  );
}
