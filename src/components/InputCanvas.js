import React, { useRef, useEffect, useCallback, useState } from "react";
import { FaPencilAlt, FaEraser, FaTimes } from "react-icons/fa";

export default function InputCanvas({ width = 280, height = 280, onChange }) {
  const canvasRef = useRef(null);
  const smallRef = useRef(null);
  const drawing = useRef(false);
  const [mode, setMode] = useState("pencil"); // 'pencil' or 'eraser'

  // Down-sample & emit input
  const updateInput = useCallback(() => {
    const cnv = canvasRef.current;
    const small = smallRef.current;
    if (!cnv || !small) return;
    const smallCtx = small.getContext("2d");
    smallCtx.drawImage(
      cnv,
      0,
      0,
      cnv.width,
      cnv.height,
      0,
      0,
      small.width,
      small.height
    );
    const img = smallCtx.getImageData(0, 0, small.width, small.height).data;
    const arr = [];
    for (let i = 0; i < img.length; i += 4) {
      arr.push(img[i] / 255);
    }
    onChange(arr);
  }, [onChange]);

  // Initialize big + offscreen small canvas
  useEffect(() => {
    const cnv = canvasRef.current;
    cnv.width = width;
    cnv.height = height;
    const ctx = cnv.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    const small = document.createElement("canvas");
    small.width = 28;
    small.height = 28;
    smallRef.current = small;

    updateInput();
  }, [width, height, updateInput]);

  // Pointer event handlers
  const pointerDown = () => {
    drawing.current = true;
  };
  const pointerUp = () => {
    drawing.current = false;
    updateInput();
  };
  const pointerMove = (e) => {
    if (!drawing.current) return;
    const cnv = canvasRef.current;
    const rect = cnv.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * cnv.width;
    const y = ((e.clientY - rect.top) / rect.height) * cnv.height;
    const ctx = cnv.getContext("2d");
    ctx.fillStyle = mode === "pencil" ? "white" : "black";
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();
    updateInput();
  };

  // Clear button handler
  const clearCanvas = useCallback(() => {
    const cnv = canvasRef.current;
    const ctx = cnv.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    updateInput();
  }, [updateInput]);

  // shared button style
  const btnStyle = {
    padding: 8,
    background: "transparent",
    border: "1px solid #fff",
    borderRadius: 4,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{ marginBottom: 8, display: "flex", gap: 8 }}>
        <button
          onClick={() => setMode("pencil")}
          style={{ ...btnStyle, opacity: mode === "pencil" ? 1 : 0.6 }}
          title="Pencil"
        >
          <FaPencilAlt size={16} />
        </button>
        <button
          onClick={() => setMode("eraser")}
          style={{ ...btnStyle, opacity: mode === "eraser" ? 1 : 0.6 }}
          title="Eraser"
        >
          <FaEraser size={16} />
        </button>
        <button onClick={clearCanvas} style={btnStyle} title="Clear">
          <FaTimes size={16} />
        </button>
      </div>
      <canvas
        ref={canvasRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          border: "2px solid #666",
          borderRadius: 8,
          background: "#222",
          cursor: mode === "pencil" ? "crosshair" : "not-allowed",
        }}
        onPointerDown={pointerDown}
        onPointerUp={pointerUp}
        onPointerMove={pointerMove}
      />
    </div>
  );
}
