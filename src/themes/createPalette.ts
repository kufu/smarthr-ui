import { merge } from '../libs/lodash'

// Allow deviations from the JavaScript naming convention to match SmartHR design guidelines
export interface PaletteProperty {
  Background?: string
  Background_Omen?: string
  Background_Omen_M07?: string
  Black?: string
  Mono_P80?: string
  Mono_P60?: string
  Mono_P40?: string
  Mono_P30?: string
  Mono_P20?: string
  Mono_P10?: string
  Mono_P05?: string
  Mono_P03?: string
  White?: string
  Overlay?: string
  SmartHRGreen?: string
  Main_P20?: string
  Main_P10?: string
  Main?: string
  GreenGray?: string
  GreenGray_M20?: string
  Blue_P30?: string
  Blue?: string
  Blue_M20?: string
  Orange_P10?: string
  Orange?: string
  Orange_M30?: string
  Red?: string
}

export interface CreatedPaletteTheme {
  Background: string
  Background_Omen: string
  Background_Omen_M07: string
  Black: string
  Mono_P80: string
  Mono_P60: string
  Mono_P40: string
  Mono_P30: string
  Mono_P20: string
  Mono_P10: string
  Mono_P05: string
  Mono_P03: string
  White: string
  Overlay: string
  SmartHRGreen: string
  Main_P20: string
  Main_P10: string
  Main: string
  GreenGray: string
  GreenGray_M20: string
  Blue_P30: string
  Blue: string
  Blue_M20: string
  Orange_P10: string
  Orange: string
  Orange_M30: string
  Yellow: string
  Red: string
}

export const defaultPalette: CreatedPaletteTheme = {
  Background: '#f5f6fa',
  Background_Omen: '#009ea6',
  Background_Omen_M07: '#0dbac1',

  Black: '#333',
  Mono_P80: '#5c5c5c',
  Mono_P60: '#858585',
  Mono_P40: '#adadad',
  Mono_P30: '#c1c1c1',
  Mono_P20: '#d6d6d6',
  Mono_P10: '#eaeaea',
  Mono_P05: '#f5f5f5',
  Mono_P03: '#f9f9f9',
  White: '#fff',
  Overlay: 'rgba(51, 51, 51, 0.4)',

  SmartHRGreen: '#00c4cc',
  Main_P20: '#007378',
  Main_P10: '#008d91',
  Main: '#00a5ab',

  GreenGray: '#6bb0b3',
  GreenGray_M20: '#f0f9fa',

  Blue_P30: '#005180',
  Blue: '#0081cc',
  Blue_M20: '#4dbdff',

  Orange_P10: '#e67a00',
  Orange: '#f80',
  Orange_M30: '#ffac4d',

  Yellow: '#fc0',

  Red: '#ef475b',
}

export const createPalette = (userPalette: PaletteProperty = {}) => {
  const created = merge(defaultPalette, userPalette)
  return created
}
