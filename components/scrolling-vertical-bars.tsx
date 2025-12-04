"use client"

import { useEffect, useRef, useState } from "react"

const ScrollingVerticalBars = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const scrollPositionRef = useRef(0)
  const animationFrameId = useRef<number | null>(null)
  const isPausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const [colorMood, setColorMood] = useState<string>("monochrome");

  // Color palettes for different moods
  const moodPalettes: Record<
    string,
    { colors: string[][]; background: string; lines: string }
  > = {
    monochrome: {
      colors: [
        ["#000000", "#333333", "#666666"],
        ["#000000", "#333333", "#666666"],
        ["#000000", "#333333", "#666666"],
        ["#000000", "#333333", "#666666"],
        ["#000000", "#333333", "#666666"],
      ],
      background: "#F0EEE6",
      lines: "#666666",
    },
    warm: {
      colors: [
        ["#8B4513", "#CD853F", "#DEB887"],
        ["#D2691E", "#F4A460", "#FFDAB9"],
        ["#A0522D", "#BC8F8F", "#F5DEB3"],
        ["#8B0000", "#CD5C5C", "#FFA07A"],
        ["#B8860B", "#DAA520", "#FFD700"],
      ],
      background: "#FFF8F0",
      lines: "#D2B48C",
    },
    cool: {
      colors: [
        ["#191970", "#4169E1", "#87CEEB"],
        ["#006400", "#2E8B57", "#98FB98"],
        ["#008B8B", "#20B2AA", "#AFEEEE"],
        ["#483D8B", "#6A5ACD", "#B0C4DE"],
        ["#2F4F4F", "#5F9EA0", "#B0E0E6"],
      ],
      background: "#F0F8FF",
      lines: "#708090",
    },
    vibrant: {
      colors: [
        ["#FF1493", "#FF69B4", "#FFB6C1"],
        ["#FF4500", "#FF6347", "#FFA500"],
        ["#9400D3", "#BA55D3", "#DDA0DD"],
        ["#00CED1", "#40E0D0", "#7FFFD4"],
        ["#32CD32", "#7CFC00", "#ADFF2F"],
      ],
      background: "#FFFAF0",
      lines: "#DDA0DD",
    },
    earth: {
      colors: [
        ["#3D2914", "#5C4033", "#8B7355"],
        ["#556B2F", "#6B8E23", "#9ACD32"],
        ["#8B4513", "#A0522D", "#CD853F"],
        ["#2F4F4F", "#696969", "#808080"],
        ["#654321", "#8B7765", "#C4A484"],
      ],
      background: "#F5F5DC",
      lines: "#8B7355",
    },
    dark: {
      colors: [
        ["#E0E0E0", "#B0B0B0", "#808080"],
        ["#C0C0C0", "#A0A0A0", "#707070"],
        ["#D0D0D0", "#909090", "#606060"],
        ["#B8B8B8", "#888888", "#585858"],
        ["#C8C8C8", "#989898", "#686868"],
      ],
      background: "#1A1A1A",
      lines: "#333333",
    },
    sunset: {
      colors: [
        ["#FF6B6B", "#EE5A24", "#F79F1F"],
        ["#E74C3C", "#C0392B", "#922B21"],
        ["#FF8C00", "#FF7F50", "#FFA07A"],
        ["#9B59B6", "#8E44AD", "#6C3483"],
        ["#E91E63", "#AD1457", "#880E4F"],
      ],
      background: "#2C1810",
      lines: "#4A3728",
    },
    ocean: {
      colors: [
        ["#0077B6", "#00B4D8", "#90E0EF"],
        ["#023E8A", "#0096C7", "#48CAE4"],
        ["#03045E", "#0077B6", "#ADE8F4"],
        ["#005F73", "#0A9396", "#94D2BD"],
        ["#001219", "#005F73", "#E9D8A6"],
      ],
      background: "#CAF0F8",
      lines: "#90E0EF",
    },
  };

  const moodLabels: Record<string, string> = {
    monochrome: "Monochrome",
    warm: "Warm",
    cool: "Cool",
    vibrant: "Vibrant",
    earth: "Earth",
    dark: "Dark Mode",
    sunset: "Sunset",
    ocean: "Ocean",
  };

  // Fixed values instead of state variables
  const speed = 0.0025;
  const numColors = 5;
  const patternScale = 3;
  const verticalProgression = 1.5;
  const [customChars, setCustomChars] = useState(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*"
  );

  const pattern1Ref = useRef<any[] | null>(null);
  const pattern2Ref = useRef<any[] | null>(null);

  useEffect(() => {
    // Clear patterns when characters change to force regeneration
    pattern1Ref.current = null;
    pattern2Ref.current = null;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      // Set fixed dimensions
      canvas.width = 896;
      canvas.height = 576;
    };

    updateCanvasSize();

    // Add resize listener
    const handleResize = () => {
      updateCanvasSize();
      // Clear patterns to force regeneration with new size
      pattern1Ref.current = null;
      pattern2Ref.current = null;
    };

    window.addEventListener("resize", handleResize);

    const numLines = 60;
    const lineSpacing = canvas.width / numLines;

    const chars =
      customChars.length > 0
        ? customChars
        : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";

    // Get current mood palette
    const currentPalette = moodPalettes[colorMood] || moodPalettes.monochrome;
    const colorBands = currentPalette.colors;

    const createPattern = (offset: number) => {
      const pattern = [];
      for (let i = 0; i < numLines; i++) {
        const bars = [];
        const numBars = 10 + Math.sin(i * 0.3 + offset) * 5;
        for (let j = 0; j < numBars; j++) {
          const randomCharIndex = Math.floor(
            Math.abs(Math.sin(i * 12.9898 + j * 78.233) * 43758.5453) %
              chars.length
          );
          bars.push({
            y:
              (j / numBars) * canvas.height +
              Math.sin(i * 0.5 + j * 0.3 + offset) * 30,
            height: 5 + Math.sin(i * 0.2 + j * 0.4) * 3,
            width: 2 + Math.cos(i * 0.3) * 2,
            opacity: 0.5 + Math.sin(i * 0.4 + j * 0.2) * 0.3,
            char: chars[randomCharIndex],
            lineIndex: i,
            barIndex: j,
          });
        }
        pattern.push(bars);
      }
      return pattern;
    };

    // Only create patterns once on initial mount or when chars change
    if (!pattern1Ref.current || !pattern2Ref.current) {
      pattern1Ref.current = createPattern(0);
      pattern2Ref.current = createPattern(Math.PI);
    }

    const pattern1 = pattern1Ref.current;
    const pattern2 = pattern2Ref.current;

    const getColorFromDiamondPattern = (
      lineIndex: number,
      barIndex: number
    ) => {
      // Determine which horizontal band we're in
      const bandHeight = canvas.height / numColors;
      const yPos = (barIndex / 15) * canvas.height;
      const bandIndex = Math.floor(yPos / bandHeight) % numColors;
      const palette = colorBands[bandIndex % colorBands.length];

      // Create more pronounced diamond/zigzag pattern
      const zigzag = Math.abs(
        ((lineIndex + Math.floor(barIndex * verticalProgression)) %
          (palette.length * 2 * patternScale)) -
          palette.length * patternScale
      );
      const colorIndex = Math.floor(zigzag / patternScale) % palette.length;

      return palette[colorIndex];
    };

    const animate = () => {
      if (!isPausedRef.current) {
        scrollPositionRef.current += speed;
      }
      const scrollFactor = (Math.sin(scrollPositionRef.current) + 1) / 2;

      ctx.fillStyle = currentPalette.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < numLines; i++) {
        const x = i * lineSpacing + lineSpacing / 2;

        ctx.beginPath();
        ctx.strokeStyle = currentPalette.lines;
        ctx.lineWidth = 1;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

        const bars1 = pattern1[i];
        const bars2 = pattern2[i];
        const maxBars = Math.max(bars1.length, bars2.length);

        for (let j = 0; j < maxBars; j++) {
          const bar1 = bars1[j] || bars2[j];
          const bar2 = bars2[j] || bars1[j];

          const y = bar1.y + (bar2.y - bar1.y) * scrollFactor;
          const height =
            bar1.height + (bar2.height - bar1.height) * scrollFactor;
          const width = bar1.width + (bar2.width - bar1.width) * scrollFactor;
          const opacity =
            bar1.opacity + (bar2.opacity - bar1.opacity) * scrollFactor;

          const charToDisplay = bar1.char || bar2.char;
          const lineIndex =
            bar1.lineIndex !== undefined ? bar1.lineIndex : bar2.lineIndex;
          const barIndex =
            bar1.barIndex !== undefined ? bar1.barIndex : bar2.barIndex;

          // Calculate color dynamically based on current parameters
          const colorToDisplay = getColorFromDiamondPattern(
            lineIndex,
            barIndex
          );

          const fontSize = 8 + width * 2;
          ctx.font = `${fontSize}px monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const hexToRgba = (hex: string, alpha: number) => {
            const r = Number.parseInt(hex.slice(1, 3), 16);
            const g = Number.parseInt(hex.slice(3, 5), 16);
            const b = Number.parseInt(hex.slice(5, 7), 16);
            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
          };

          ctx.fillStyle = hexToRgba(colorToDisplay, opacity);
          ctx.fillText(charToDisplay, x, y);
        }
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
      // Only reset scroll position when chars change, not on mood change
      // scrollPositionRef.current = 0;
    };
  }, [customChars, colorMood]); // Re-run when customChars or colorMood changes

  // Toggle pause/play
  const handleCanvasClick = () => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused(isPausedRef.current);
  };

  // Export canvas as PNG image
  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `woven-record-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
      {/* Title and Description */}
      <div className="text-center mb-8">
        <span>
          YOUR WORDS BECOME LETTERS&nbsp;&nbsp; {"  "}&nbsp;&nbsp;YOUR LETTERS
          BECOME THE MESSAGE
        </span>
        <h1 className="text-8xl font-extralight cap mb-4 uppercase text">
          Woven Records
        </h1>
        <div className="w-4xl mx-auto space-y-2">
          <p className="text-md leading-4 italic">
            Those letters are the material <br /> of this digital textile <br />{" "}
            — record of what you
            <br />
            chose to keep.
          </p>
        </div>
      </div>

      {/* Canvas Animation */}
      <div className="flex justify-center">
        <div className="relative w-4xl h-[576px] group">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="cursor-pointer"
            style={{ display: "block", width: "100%", height: "100%" }}
          />
          {/* Pause indicator overlay */}
          {isPaused && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/50 text-white px-4 py-2 rounded-md text-sm font-medium">
                Paused — Click to resume
              </div>
            </div>
          )}
          {/* Hint on hover when not paused */}
          {!isPaused && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-black/30 text-white px-4 py-2 rounded-md text-sm font-medium">
                Click to freeze
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mood Selector */}
      <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
        {Object.keys(moodPalettes).map((mood) => {
          const palette = moodPalettes[mood];
          const isActive = colorMood === mood;
          const isDark = mood === "dark" || mood === "sunset";
          return (
            <button
              key={mood}
              onClick={() => setColorMood(mood)}
              className={`
                relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "ring-2 ring-offset-2 ring-black scale-105"
                    : "hover:scale-105"
                }
              `}
              style={{
                backgroundColor: palette.background,
                color: isDark ? "#ffffff" : "#333333",
                border: `2px solid ${palette.lines}`,
              }}
            >
              <span className="flex items-center gap-2">
                {/* Color preview dots */}
                <span className="flex -space-x-1">
                  {palette.colors[0].slice(0, 3).map((color, i) => (
                    <span
                      key={i}
                      className="w-3 h-3 rounded-full border border-white/50"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </span>
                {moodLabels[mood]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Export as Image
      </button>

      {/* Custom Characters Input */}
      <div className="w-full max-w-4xl">
        <div className="space-y-3.5 mt-8">
          <label className="text-xl font-medium ">
            Write something you never want to forget.
          </label>
          <input
            type="text"
            value={customChars}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCustomChars(e.target.value)
            }
            placeholder="Enter characters to display (you can use letters, numbers, or symbols)"
            className="w-full border rounded-xs border-[#f0eee6] font-mono py-2 bg-white pl-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#f0eee6]"
          />
          <p
            className="text-xs "
            style={{ fontFamily: "goudy-old-style, serif", fontSize: "16px" }}
          ></p>
        </div>
      </div>
    </div>
  );
}

export default ScrollingVerticalBars
