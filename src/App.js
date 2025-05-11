import React, { useState, useEffect } from "react";
import InputCanvas from "./components/InputCanvas";
import NetworkVis from "./components/NetworkVis";
import useNetwork from "./hooks/useNetwork";

export default function App() {
  const [inputArr, setInputArr] = useState(Array(784).fill(0));
  const { activations, error } = useNetwork(inputArr);

  // whenever activations change, POST to our gateway
  useEffect(() => {
    if (!activations) return;
    fetch("http://localhost:3001/activations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hidden1: activations.hidden1,
        hidden2: activations.hidden2,
        output: activations.output,
      }),
    }).catch(console.error);
  }, [activations]);

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
