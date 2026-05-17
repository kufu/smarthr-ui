/**
 * Chart コンポーネント用の共有テストデータ
 * Playground Story と VRT Story で重複を排除するために使用
 */

/**
 * 少データポイント（5個）- 単一データセット
 */
export const singleSmall = {
  labels: ['A', 'B', 'C', 'D', 'E'],
  datasets: [
    {
      label: 'データ1',
      data: [12, 19, 3, 5, 2],
    },
  ],
}

/**
 * 少データポイント（5個）- 複数データセット（3個）
 */
export const multiSmall = {
  labels: ['A', 'B', 'C', 'D', 'E'],
  datasets: [
    {
      label: 'データ1',
      data: [12, 19, 3, 5, 2],
    },
    {
      label: 'データ2',
      data: [8, 11, 15, 7, 9],
    },
    {
      label: 'データ3',
      data: [5, 14, 8, 12, 6],
    },
  ],
}

/**
 * 多データポイント（12個）- 複数データセット（3個）
 */
export const manyPoints = {
  labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  datasets: [
    {
      label: 'データ1',
      data: [12, 19, 3, 5, 2, 18, 7, 15, 8, 11, 4, 14],
    },
    {
      label: 'データ2',
      data: [8, 11, 15, 7, 9, 5, 13, 6, 17, 9, 12, 10],
    },
    {
      label: 'データ3',
      data: [5, 14, 8, 12, 6, 11, 9, 18, 4, 13, 7, 16],
    },
  ],
}

/**
 * Radar チャート用 - 少データ（5軸）- 単一データセット
 */
export const radarSingleSmall = {
  labels: ['企画力', '実行力', '協調性', '分析力', 'コミュニケーション'],
  datasets: [
    {
      label: 'データ1',
      data: [80, 65, 90, 55, 75],
    },
  ],
}

/**
 * Radar チャート用 - 少データ（5軸）- 複数データセット（3個）
 */
export const radarMultiSmall = {
  labels: ['企画力', '実行力', '協調性', '分析力', 'コミュニケーション'],
  datasets: [
    {
      label: 'グループA',
      data: [80, 65, 90, 55, 75],
    },
    {
      label: 'グループB',
      data: [60, 80, 70, 85, 60],
    },
    {
      label: 'グループC',
      data: [70, 55, 80, 65, 90],
    },
  ],
}

/**
 * Radar チャート用 - 多軸（8軸）- 複数データセット（2個）
 */
export const radarManyAxes = {
  labels: ['速度', '精度', '安全性', '快適性', '経済性', '環境性能', '耐久性', '操作性'],
  datasets: [
    {
      label: 'モデルA',
      data: [85, 70, 90, 75, 60, 80, 65, 70],
    },
    {
      label: 'モデルB',
      data: [70, 85, 75, 80, 75, 65, 80, 85],
    },
  ],
}

/**
 * chart.js オプションのサンプル
 */
export const chartJsOptionsExamples = {
  /**
   * データラベル表示設定
   */
  datalabels: {
    plugins: {
      datalabels: {
        display: true,
        anchor: 'end' as const,
        align: 'end' as const,
        color: '#333',
        font: {
          weight: 'bold' as const,
          size: 12,
        },
      },
    },
  },

  /**
   * データラベル表示設定（線グラフ用：背景・枠線付き）
   */
  datalabelsWithBorder: {
    plugins: {
      datalabels: {
        display: true,
        backgroundColor: '#fff',
        borderColor: '#333',
        borderWidth: 1,
        borderRadius: 4,
        color: '#333',
        font: {
          weight: 'bold' as const,
          size: 12,
        },
        padding: 4,
      },
    },
  },

  /**
   * スケール・目盛りカスタマイズ
   */
  customScales: {
    scales: {
      y: {
        ticks: {
          stepSize: 50,
        },
        suggestedMax: 150,
      },
    },
  },

  /**
   * 包括的なカスタマイズ例（データラベル + スケール設定）
   */
  comprehensive: {
    plugins: {
      datalabels: {
        display: true,
        anchor: 'end' as const,
        align: 'end' as const,
        color: '#333',
        font: {
          weight: 'bold' as const,
          size: 12,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 50,
        },
        suggestedMax: 150,
      },
    },
    datasets: {
      bar: {
        barPercentage: 0.8,
        categoryPercentage: 0.9,
      },
    },
  },
}
