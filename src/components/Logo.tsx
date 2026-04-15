type Props = {
  size?: number
  className?: string
}

export function Logo({ size = 36, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Tabletop logo"
    >
      <defs>
        <linearGradient id="tabletop-logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff7a59" />
          <stop offset="55%" stopColor="#ff385c" />
          <stop offset="100%" stopColor="#c81d5a" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="34" height="34" rx="9" fill="url(#tabletop-logo-gradient)" />
      <g fill="#ffffff">
        <circle cx="13" cy="13" r="2.6" />
        <circle cx="27" cy="13" r="2.6" />
        <circle cx="20" cy="20" r="2.6" />
        <circle cx="13" cy="27" r="2.6" />
        <circle cx="27" cy="27" r="2.6" />
      </g>
    </svg>
  )
}
