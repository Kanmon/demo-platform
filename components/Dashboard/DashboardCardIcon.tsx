import { pSBC } from '@/utils/pSBC'

export const DashboardCardIcon = ({ color, id }: { color: string; id: string }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id={`${id}-b`}>
        <stop stopColor={pSBC(0.4, color) as string} offset="0%" />
        <stop stopColor={color} offset="100%" />
      </linearGradient>
      <linearGradient x1="50%" y1="24.537%" x2="50%" y2="100%" id={`${id}-c`}>
        <stop stopColor={pSBC(-0.4, color) as string} offset="0%" />
        <stop stopColor={color} stopOpacity="0" offset="100%" />
      </linearGradient>
      <path id={`${id}-a`} d="M16 0l16 32-16-5-16 5z" />
    </defs>
    <g transform="rotate(90 16 16)" fill="none" fillRule="evenodd">
      <mask id={`${id}-d`} fill="#fff">
        <use xlinkHref={`#${id}-a`} />
      </mask>
      <use fill={`url(#${id}-b)`} xlinkHref={`#${id}-a`} />
      <path fill={`url(#${id}-c)`} mask={`url(#${id}-d)`} d="M16-6h20v38H16z" />
    </g>
  </svg>
)
