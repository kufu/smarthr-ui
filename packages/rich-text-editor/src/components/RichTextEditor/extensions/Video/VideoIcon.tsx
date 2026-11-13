import type { FC } from 'react'

/** smarthr-ui に動画のアイコンが無いため、エディタ内に持つ */
export const VideoIcon: FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    focusable="false"
    width="1em"
    height="1em"
    aria-hidden="true"
  >
    <rect x="1.5" y="5.5" rx="2.5" width="14" height="13" />
    <path d="M16.5 10.2 22.5 6.8v10.4l-6-3.4z" />
  </svg>
)
