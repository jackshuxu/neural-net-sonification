import React, { useRef, useEffect, useCallback } from "react";

export default function InputCanvas({ width = 280, height = 280, onChange }) {
  const canvasRef = useRef(null);
  const smallRef = useRef(null);
  const drawing = useRef(false);

  // Down‐sample & emit input
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
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();
    updateInput();
  };

  // Clear button
  const clearCanvas = useCallback(() => {
    const cnv = canvasRef.current;
    const ctx = cnv.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    updateInput();
  }, [updateInput]);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <canvas
        ref={canvasRef}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          border: "2px solid #666",
          borderRadius: 8,
          background: "#222",
          cursor: "crosshair",
        }}
        onPointerDown={pointerDown}
        onPointerUp={pointerUp}
        onPointerMove={pointerMove}
      />
      <button
        onClick={clearCanvas}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          padding: "4px 8px",
          background: "#eee",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Clear
      </button>
    </div>
  );
}
