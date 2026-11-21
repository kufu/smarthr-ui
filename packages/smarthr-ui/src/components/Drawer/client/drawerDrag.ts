// ドラッグ終了後の投影距離（速度 × この係数 だけ進むと仮定）
const VELOCITY_PROJECTION_MS = 100

// 最後の pointermove からこの時間が経つと、離した時点の速度を 0 とみなす
const VELOCITY_DECAY_MS = 100

const CLOSE_VELOCITY_THRESHOLD = 0.5 // px/ms

type DecayVelocityArgs = {
  /** 最後の pointermove で観測した速度(px/ms) */
  velocity: number
  /** 最後の pointermove から離すまでの経過時間(ms) */
  idleMs: number
}

/** 観測値をそのまま使うと、勢いよく動かして静止してから離してもフリック扱いになるため減衰させる */
export const decayVelocity = ({ velocity, idleMs }: DecayVelocityArgs) =>
  velocity * Math.max(0, 1 - idleMs / VELOCITY_DECAY_MS)

type DragEndArgs = {
  /** 全開時のサイズ(px) */
  fullSize: number
  /** ドラッグ終了時点の開きサイズ(px) */
  currentSize: number
  /** px/ms。正=開く方向、負=閉じる方向 */
  velocity: number
}

export const shouldCloseOnDragEnd = ({ fullSize, currentSize, velocity }: DragEndArgs) =>
  velocity < -CLOSE_VELOCITY_THRESHOLD ||
  currentSize + velocity * VELOCITY_PROJECTION_MS < fullSize / 2
