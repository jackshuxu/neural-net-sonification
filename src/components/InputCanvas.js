// src/components/InputCanvas.js
import React, { useRef, useEffect, useCallback } from "react";

export default function InputCanvas({ onChange }) {
  const canvasRef = useRef(null);
  const smallRef = useRef(null);
  const drawing = useRef(false);

  // Initialize big & small canvases
  useEffect(() => {
    const cnv = canvasRef.current;
    cnv.width = 280;
    cnv.height = 280;
    const ctx = cnv.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    // create an offscreen 28×28 canvas
    const small = document.createElement("canvas");
    small.width = 28;
    small.height = 28;
    smallRef.current = small;

    // Emit the initial blank input
    updateInput();
  }, []);

  // Down‐sample & emit
  const updateInput = useCallback(() => {
    const cnv = canvasRef.current;
    const small = smallRef.current;
    const smallCtx = small.getContext("2d");

    // draw & scale
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
      // we drew white-on-black, so R==G==B; just take R
      arr.push(img[i] / 255);
    }
    onChange(arr);
  }, [onChange]);

  // Handlers
  const pointerDown = (e) => {
    drawing.current = true;
  };
  const pointerUp = (e) => {
    drawing.current = false;
    updateInput();
  };
  const pointerMove = (e) => {
    if (!drawing.current) return;
    const cnv = canvasRef.current;
    const rect = cnv.getBoundingClientRect();
    const ctx = cnv.getContext("2d");
    // map pointer coords → canvas coords
    const x = ((e.clientX - rect.left) / rect.width) * cnv.width;
    const y = ((e.clientY - rect.top) / rect.height) * cnv.height;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fill();
    updateInput();
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ border: "1px solid #444", touchAction: "none" }}
      onPointerDown={pointerDown}
      onPointerUp={pointerUp}
      onPointerMove={pointerMove}
    />
  );
}
