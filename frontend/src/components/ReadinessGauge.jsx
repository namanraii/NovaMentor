import { useEffect, useState } from 'react'

export default function ReadinessGauge({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  // Determine color based on score
  const getColor = (val) => {
    if (val >= 70) return '#10b981' // Green
    if (val >= 40) return '#f59e0b' // Amber
    return '#ef4444' // Red
  }

  const color = getColor(animatedScore)

  // Count up animation
  useEffect(() => {
    const duration = 1500 // 1.5s
    const steps = 30
    const stepTime = duration / steps
    const increment = score / steps
    let current = 0
    let timer

    if (score > 0) {
      timer = setInterval(() => {
        current += increment
        if (current >= score) {
          setAnimatedScore(score)
          clearInterval(timer)
        } else {
          setAnimatedScore(Math.round(current))
        }
      }, stepTime)
    }

    return () => clearInterval(timer)
  }, [score])

  // SVG Arc calculation
  const radius = 80
  const circumference = 2 * Math.PI * radius
  // Show only 75% of the circle (an arc from bottom-left to bottom-right)
  const arcLength = circumference * 0.75 
  const dashOffset = arcLength - (animatedScore / 100) * arcLength

  return (
    <div className="relative w-48 h-48 flex items-center justify-center translate-y-4">
      <svg className="w-full h-full transform -rotate-[135deg]" viewBox="0 0 200 200">
        {/* Background Arc */}
        <circle
          cx="100" cy="100" r={radius}
          fill="none" stroke="#1e3a5f" strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
        />
        {/* Progress Arc */}
        <circle
          cx="100" cy="100" r={radius}
          fill="none" stroke={color} strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.1s ease-out, stroke 0.3s' }}
          className="drop-shadow-[0_0_8px_rgba(var(--color),0.5)]"
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pb-4">
        <span 
          className="text-5xl font-black tabular-nums tracking-tighter"
          style={{ color, textShadow: `0 0 20px ${color}80` }}
        >
          {animatedScore}
        </span>
        <span className="text-gray-400 text-sm font-semibold tracking-widest mt-1">/ 100</span>
      </div>
    </div>
  )
}
