import React, { useState } from "react";
import InputCanvas from "./components/InputCanvas";
import NetworkVis from "./components/NetworkVis";
import useNetwork from "./hooks/useNetwork";

export default function App() {
  const [inputArr, setInputArr] = useState(Array(784).fill(0));
  const { activations, error } = useNetwork(inputArr);

  return (
    <div style={{ display: "flex", gap: 20, padding: 20, height: "100vh" }}>
      <div>
        <h3 style={{ color: "#fff" }}>Draw Digit</h3>
        <InputCanvas onChange={setInputArr} />
      </div>
      <div style={{ flexGrow: 1 }}>
        <h3 style={{ color: "#fff" }}>Activations</h3>
        <NetworkVis acts={activations} error={error} />
      </div>
    </div>
  );
}
