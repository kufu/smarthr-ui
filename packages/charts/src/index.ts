/// <reference types="chartjs-plugin-datalabels" preserve="true" />

/*
 * ツリーシェイキングを効かせる。そのため require-barrel-import を意図的に無効化する。
 */
/* eslint-disable smarthr/require-barrel-import */
export { Chart } from './components/Chart'
export { DoughnutChart } from './components/DoughnutChart'
export { ProgressDoughnutChart } from './components/ProgressDoughnutChart'
/* eslint-enable smarthr/require-barrel-import */
