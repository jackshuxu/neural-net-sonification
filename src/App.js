import React, { useState } from "react";
import InputCanvas from "./components/InputCanvas";
import NetworkVis from "./components/NetworkVis";
import useNetwork from "./hooks/useNetwork";

export default function App() {
  const [inputArr, setInputArr] = useState(Array(784).fill(0));
  const { activations, error } = useNetwork(inputArr);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // stack rows instead of side-by-side
        alignItems: "center",
        gap: 40,
        padding: 40,
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h3>Draw Digit</h3>
        <InputCanvas width={350} height={350} onChange={setInputArr} />
      </div>

      <div style={{ width: "100%" }}>
        <h3 style={{ color: "#eee", textAlign: "center" }}>Activations</h3>
        <NetworkVis acts={activations} error={error} />
      </div>
    </div>
  );
}
