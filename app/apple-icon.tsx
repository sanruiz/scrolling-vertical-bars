import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  const gridSize = 6;
  const cellSize = 30;
  const colors = ["#E63946", "#F77F00", "#FCBF49", "#2D6A4F", "#1D3557"];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          height: "100%",
          backgroundColor: "#1A1A1A",
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
          const row = Math.floor(i / gridSize);
          const col = i % gridSize;
          // Diagonal pattern like woven fabric
          const colorIndex = (row + col) % colors.length;
          return (
            <div
              key={i}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: colors[colorIndex],
                opacity: ((row + col) % 2 === 0) ? 1 : 0.7,
              }}
            />
          );
        })}
      </div>
    ),
    {
      ...size,
    }
  );
}
