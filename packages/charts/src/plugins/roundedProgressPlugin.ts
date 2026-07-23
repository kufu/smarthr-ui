import type { Chart } from 'chart.js'

export type RoundedProgressOptions = {
  /** 丸端で描く対象のセグメント index（進捗部分）。既定 0 */
  segmentIndex?: number
  /** 進捗の色。省略時は対象セグメントの backgroundColor を使う */
  color?: string
  /** hover / 選択中の進捗の色。省略時は color のまま */
  hoverColor?: string
  /** hover / 選択中に進捗の帯の内側へ描く縁取りの色。省略時は縁取りを描かない */
  hoverBorderColor?: string
  /** hover / 選択中に進捗の帯の内側へ描く縁取りの太さ。既定 0 */
  hoverBorderWidth?: number
}

type ArcLike = {
  x: number
  y: number
  startAngle: number
  endAngle: number
  outerRadius: number
  innerRadius: number
  circumference: number
  options?: { backgroundColor?: string }
}

/**
 * 進捗セグメントを「丸い端（round cap）を持つ太い円弧」として描き直すプラグイン。
 *
 * borderRadius だと丸端同士が境界で向き合って隙間ができる。
 * データセット重ねだと太さ・位置がずれる。arc の両端に円を描く方式だと
 * hover 時の枠が arc 本体の枠と一体化しない。
 *
 * そこで進捗セグメントの塗りは chart.js 側で透明にしておき（hit 判定・キーボードナビ・
 * tooltip は元の arc のまま保たれる）、見た目の進捗はこのプラグインが
 * `lineCap: 'round'` の円弧ストロークで描く。これにより両端が自然に丸くなり、
 * hover の縁取りも同じ円弧で描くだけで丸端まで含めて一体化する。
 */
export const roundedProgressPlugin = {
  id: 'roundedProgress',
  defaults: {
    segmentIndex: 0,
    color: undefined,
    hoverColor: undefined,
    hoverBorderColor: undefined,
    hoverBorderWidth: 0,
  },
  afterDatasetDraw: (chart: Chart, args: { index: number }, options: RoundedProgressOptions) => {
    const meta = chart.getDatasetMeta(args.index)
    if (meta.hidden) {
      return
    }

    const segmentIndex = options.segmentIndex ?? 0
    const arc = meta.data[segmentIndex] as unknown as ArcLike | undefined
    if (!arc) {
      return
    }

    // 進捗が 0（円弧なし）または全周のときは何もしない（全周は丸端が不要）
    if (arc.circumference <= 0 || arc.circumference >= Math.PI * 2) {
      return
    }

    const isActive = chart
      .getActiveElements()
      .some((el) => el.datasetIndex === args.index && el.index === segmentIndex)
    const color =
      (isActive ? options.hoverColor : undefined) ?? options.color ?? arc.options?.backgroundColor
    if (!color) {
      return
    }

    const { ctx } = chart
    const midRadius = (arc.outerRadius + arc.innerRadius) / 2
    const thickness = arc.outerRadius - arc.innerRadius

    const strokeArc = (centerRadius: number, strokeStyle: string, lineWidth: number) => {
      ctx.beginPath()
      ctx.arc(arc.x, arc.y, centerRadius, arc.startAngle, arc.endAngle)
      ctx.strokeStyle = strokeStyle
      ctx.lineWidth = lineWidth
      ctx.lineCap = 'round'
      ctx.stroke()
    }

    ctx.save()
    const borderColor = options.hoverBorderColor
    const borderWidth = options.hoverBorderWidth ?? 0

    if (isActive && borderColor && borderWidth > 0) {
      // hover の縁取りは帯の「外」に足すと幅をはみ出して canvas 端で見切れる。
      // そこで帯と同じ太さ・同じ位置でまず縁取り色を描き（丸端まで含めて縁取りの下地）、
      // その内側 borderWidth 分を残して進捗色を細く重ねる。結果、外周・内周・両丸端の
      // すべてに borderWidth の縁ができ、帯の幅は変えないので見切れない。
      strokeArc(midRadius, borderColor, thickness)
      strokeArc(midRadius, color, thickness - borderWidth * 2)
    } else {
      strokeArc(midRadius, color, thickness)
    }
    ctx.restore()
  },
}
