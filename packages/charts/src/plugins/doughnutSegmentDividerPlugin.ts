import type { Chart } from 'chart.js'

export type DoughnutSegmentDividerOptions = {
  /** 境界線の色。省略時は描かない */
  color?: string
  /** 境界線の太さ。既定 0（描かない） */
  width?: number
}

type ArcLike = {
  x: number
  y: number
  startAngle: number
  innerRadius: number
  outerRadius: number
  circumference: number
}

/**
 * ドーナツのセグメント同士が接する境界にだけ線を描くプラグイン。
 *
 * dataset の borderColor / borderWidth だとセグメントの輪郭全周に線が付くため、
 * リングの外周・内周にも線が乗って本来の色とのアンチエイリアスが混ざり、輪郭が
 * ぼやける。borderAlign: 'inner' でも線が内側に寄るだけで外周には残る。
 * spacing で実際に隙間を空けると円の始点に切れ込みが入る。
 *
 * そこで境界（隣接するセグメントの継ぎ目）にだけ半径方向の線を引く。外周・内周は
 * 一切触らないので輪郭はシャープなまま、凡例のスウォッチも枠に削られない。
 */
export const doughnutSegmentDividerPlugin = {
  id: 'doughnutSegmentDivider',
  defaults: {
    color: undefined,
    width: 0,
  },
  afterDatasetDraw: (
    chart: Chart,
    args: { index: number },
    options: DoughnutSegmentDividerOptions,
  ) => {
    const meta = chart.getDatasetMeta(args.index)
    if (meta.hidden) {
      return
    }

    const { color } = options
    const width = options.width ?? 0
    if (!color || width <= 0) {
      return
    }

    // 値が 0 のセグメントは継ぎ目を持たないため除外する。残りが1つだけのときは
    // 境界が存在しないので、円の始点に線が入るだけになるのを避けて何も描かない。
    const visibleArcs = (meta.data as unknown as ArcLike[])
      .map((arc, index) => ({ arc, index }))
      .filter(({ arc }) => arc.circumference > 0)
    if (visibleArcs.length < 2) {
      return
    }

    const activeIndexes = new Set(
      chart
        .getActiveElements()
        .filter((el) => el.datasetIndex === args.index)
        .map((el) => el.index),
    )

    const { ctx } = chart
    ctx.save()
    ctx.strokeStyle = color
    ctx.lineWidth = width

    visibleArcs.forEach(({ arc, index }, order) => {
      // startAngle は「ひとつ前のセグメントの endAngle」と一致するので、各セグメントの
      // startAngle に線を引けば全ての継ぎ目を一度ずつ描ける。
      const previous = visibleArcs[(order - 1 + visibleArcs.length) % visibleArcs.length]

      // hover 中のセグメントには縁取りが描かれている。その上に境界線を重ねると縁取りが
      // 分断されるため、hover 中のセグメントに接する継ぎ目は描かない。
      if (activeIndexes.has(index) || activeIndexes.has(previous.index)) {
        return
      }

      const cos = Math.cos(arc.startAngle)
      const sin = Math.sin(arc.startAngle)
      ctx.beginPath()
      ctx.moveTo(arc.x + cos * arc.innerRadius, arc.y + sin * arc.innerRadius)
      ctx.lineTo(arc.x + cos * arc.outerRadius, arc.y + sin * arc.outerRadius)
      ctx.stroke()
    })

    ctx.restore()
  },
}
