import React, { useState, useEffect } from "react";
import InputCanvas from "./components/InputCanvas";
import NetworkVis from "./components/NetworkVis";
import ActivationDisplay from "./components/ActivationDisplay";
import useNetwork from "./hooks/useNetwork";

export default function App() {
  const [inputArr, setInputArr] = useState(Array(784).fill(0));
  const { activations, error } = useNetwork(inputArr);

  // derive hidden2/output safely
  const hidden1 = activations?.hidden1 || [];
  const hidden2 = activations?.hidden2 || [];
  const output = activations?.output || [];

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
        flexDirection: "column",
        alignItems: "center",
        gap: 40,
        padding: 40,
      }}
    >
      {/* Row: Input Canvas and Activation Display */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 40,
          width: "100%",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h3>Draw Digit</h3>
          <InputCanvas width={350} height={350} onChange={setInputArr} />
        </div>

        <div style={{ flex: 1 }}>
          <h3 style={{ color: "#eee", textAlign: "center" }}>
            {/* Activation Data */}
          </h3>
          <ActivationDisplay
            hidden1={hidden1}
            hidden2={hidden2}
            output={output}
          />
        </div>
      </div>

      {/* Row: Network Visualization */}
      <div style={{ width: "100%" }}>
        <h3 style={{ color: "#eee", textAlign: "center" }}>
          Activations Visualization
        </h3>
        <NetworkVis acts={activations} error={error} />
      </div>
    </div>
  );
}
