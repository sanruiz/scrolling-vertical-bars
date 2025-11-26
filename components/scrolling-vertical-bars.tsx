"use client"

import { useEffect, useRef, useState } from "react"

const ScrollingVerticalBars = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const scrollPositionRef = useRef(0)
  const animationFrameId = useRef<number | null>(null)

  // Fixed values instead of state variables
  const speed = 0.0025
  const numColors = 5
  const patternScale = 3
  const verticalProgression = 1.5
  const [customChars, setCustomChars] = useState("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*")

  const pattern1Ref = useRef<any[] | null>(null)
  const pattern2Ref = useRef<any[] | null>(null)

  useEffect(() => {
    // Clear patterns when characters change to force regeneration
    pattern1Ref.current = null
    pattern2Ref.current = null

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateCanvasSize = () => {
      // Set fixed dimensions
      canvas.width = 896
      canvas.height = 576
    }

    updateCanvasSize()

    // Add resize listener
    const handleResize = () => {
      updateCanvasSize()
      // Clear patterns to force regeneration with new size
      pattern1Ref.current = null
      pattern2Ref.current = null
    }

    window.addEventListener('resize', handleResize)

    const numLines = 60
    const lineSpacing = canvas.width / numLines

    const chars =
      customChars.length > 0
        ? customChars
        : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*"

    // Friendship bracelet inspired color palettes for different bands
    const colorBands = [
      ["#000000", "#333333", "#666666"], // Black and shades
      ["#000000", "#333333", "#666666"], // Black and shades
      ["#000000", "#333333", "#666666"], // Black and shades
      ["#000000", "#333333", "#666666"], // Black and shades
      ["#000000", "#333333", "#666666"], // Black and shades
    ]

    const createPattern = (offset: number) => {
      const pattern = []
      for (let i = 0; i < numLines; i++) {
        const bars = []
        const numBars = 10 + Math.sin(i * 0.3 + offset) * 5
        for (let j = 0; j < numBars; j++) {
          const randomCharIndex = Math.floor(Math.abs(Math.sin(i * 12.9898 + j * 78.233) * 43758.5453) % chars.length)
          bars.push({
            y: (j / numBars) * canvas.height + Math.sin(i * 0.5 + j * 0.3 + offset) * 30,
            height: 5 + Math.sin(i * 0.2 + j * 0.4) * 3,
            width: 2 + Math.cos(i * 0.3) * 2,
            opacity: 0.5 + Math.sin(i * 0.4 + j * 0.2) * 0.3,
            char: chars[randomCharIndex],
            lineIndex: i,
            barIndex: j,
          })
        }
        pattern.push(bars)
      }
      return pattern
    }

    // Only create patterns once on initial mount or when chars change
    if (!pattern1Ref.current || !pattern2Ref.current) {
      pattern1Ref.current = createPattern(0)
      pattern2Ref.current = createPattern(Math.PI)
    }

    const pattern1 = pattern1Ref.current
    const pattern2 = pattern2Ref.current

    const getColorFromDiamondPattern = (lineIndex: number, barIndex: number) => {
      // Determine which horizontal band we're in
      const bandHeight = canvas.height / numColors
      const yPos = (barIndex / 15) * canvas.height
      const bandIndex = Math.floor(yPos / bandHeight) % numColors
      const palette = colorBands[bandIndex % colorBands.length]

      // Create more pronounced diamond/zigzag pattern
      const zigzag = Math.abs(
        ((lineIndex + Math.floor(barIndex * verticalProgression)) %
          (palette.length * 2 * patternScale)) -
          palette.length * patternScale,
      )
      const colorIndex = Math.floor(zigzag / patternScale) % palette.length

      return palette[colorIndex]
    }

    const animate = () => {
      scrollPositionRef.current += speed
      const scrollFactor = (Math.sin(scrollPositionRef.current) + 1) / 2

      ctx.fillStyle = "#F0EEE6"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < numLines; i++) {
        const x = i * lineSpacing + lineSpacing / 2

        ctx.beginPath()
        ctx.strokeStyle = "#666"
        ctx.lineWidth = 1
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()

        const bars1 = pattern1[i]
        const bars2 = pattern2[i]
        const maxBars = Math.max(bars1.length, bars2.length)

        for (let j = 0; j < maxBars; j++) {
          const bar1 = bars1[j] || bars2[j]
          const bar2 = bars2[j] || bars1[j]

          const y = bar1.y + (bar2.y - bar1.y) * scrollFactor
          const height = bar1.height + (bar2.height - bar1.height) * scrollFactor
          const width = bar1.width + (bar2.width - bar1.width) * scrollFactor
          const opacity = bar1.opacity + (bar2.opacity - bar1.opacity) * scrollFactor

          const charToDisplay = bar1.char || bar2.char
          const lineIndex = bar1.lineIndex !== undefined ? bar1.lineIndex : bar2.lineIndex
          const barIndex = bar1.barIndex !== undefined ? bar1.barIndex : bar2.barIndex

          // Calculate color dynamically based on current parameters
          const colorToDisplay = getColorFromDiamondPattern(lineIndex, barIndex)

          const fontSize = 8 + width * 2
          ctx.font = `${fontSize}px monospace`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"

          const hexToRgba = (hex: string, alpha: number) => {
            const r = Number.parseInt(hex.slice(1, 3), 16)
            const g = Number.parseInt(hex.slice(3, 5), 16)
            const b = Number.parseInt(hex.slice(5, 7), 16)
            return `rgba(${r}, ${g}, ${b}, ${alpha})`
          }

          ctx.fillStyle = hexToRgba(colorToDisplay, opacity)
          ctx.fillText(charToDisplay, x, y)
        }
      }

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
        animationFrameId.current = null
      }
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      if (canvas) {
        canvas.width = 0
        canvas.height = 0
      }
      scrollPositionRef.current = 0
    }
  }, [customChars]) // Re-run when customChars changes

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6">
      {/* Title and Description */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-medium text-gray-800 mb-4" style={{ fontFamily: "goudy-old-style, serif" }}>
          Woven Records
        </h1>
        <div className="w-4xl mx-auto space-y-2">
          <p className="text-lg text-gray-700" style={{ fontFamily: "goudy-old-style, serif" }}>
            Your memories are words.
          </p>
          <p className="text-lg text-gray-700" style={{ fontFamily: "goudy-old-style, serif" }}>
            Your words are letters.
          </p>
          <p className="text-lg text-gray-700" style={{ fontFamily: "goudy-old-style, serif" }}>
            Those letters are the material of this digital textile <br/> — a record of what you wanted to keep.
          </p>
        </div>
      </div>

      {/* Canvas Animation */}
      <div className="flex justify-center">
        <div className="w-4xl h-[576px]" style={{ backgroundColor: "#F0EEE6" }}>
          <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
        </div>
      </div>

      {/* Custom Characters Input */}
      <div className="w-full max-w-4xl">
        <div className="space-y-3.5 mt-8">
          <label className="text-sm font-medium text-gray-700" style={{ fontFamily: "goudy-old-style, serif", fontSize: "22px" }}>
            Write something you never want to forget.
          </label>
          <input
            type="text"
            value={customChars}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCustomChars(e.target.value)}
            placeholder="Enter characters to display (you can use letters, numbers, or symbols)"
            className="w-full border rounded-xs border-[#f0eee6] font-mono text-[#5E5D59] placeholder-[#5E5D59] py-2 bg-white pl-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#f0eee6]"
          />
          <p className="text-xs text-gray-500" style={{ fontFamily: "goudy-old-style, serif", fontSize: "16px" }}>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ScrollingVerticalBars
