import React, { memo } from "react";

export default memo(function ActivationGrid({ data, cellSize = 12 }) {
  const rows = data.length;
  const cols = data[0]?.length || 0;
  return (
    <div
      style={{
        backgroundColor: "#000",
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        gap: "1px",
        padding: "2px",
      }}
    >
      {data.flatMap((row, i) =>
        row.map((val, j) => (
          <div
            key={`${i}-${j}`}
            style={{
              width: cellSize,
              height: cellSize,
              backgroundColor: `rgba(255,255,255,${Math.min(
                Math.max(val, 0),
                1
              )})`,
            }}
          />
        ))
      )}
    </div>
  );
});
