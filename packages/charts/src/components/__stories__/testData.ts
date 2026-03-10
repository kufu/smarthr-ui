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
