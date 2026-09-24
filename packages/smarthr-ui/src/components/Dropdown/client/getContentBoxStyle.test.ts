import { getContentBoxStyle } from './getContentBoxStyle'

const NO_SAFE_AREA_INSETS = { top: 0, right: 0, bottom: 0, left: 0 }
// iPhoneの縦向き(viewport-fit=cover)を想定した値
const SAFE_AREA_INSETS = { top: 59, right: 0, bottom: 34, left: 0 }

describe('getContentBoxStyle', () => {
  it('returns bottom style when the bottom side of the trigger has enough space to display content', () => {
    const triggerRect = { top: 100, bottom: 140, left: 0, right: 120 }
    const contentSize = { width: 300, height: 400 }
    const windowSize = { width: 1000, height: 800 }
    const scroll = { top: 0, left: 0 }
    expect(
      getContentBoxStyle(triggerRect, contentSize, windowSize, scroll, NO_SAFE_AREA_INSETS),
    ).toEqual({
      top: '135px', // 140 - 5
      left: '-5px', // trigger left - 5
      maxHeight: '',
    })
  })

  it('returns top style when the bottom side of the trigger does not have enough space to display content but top side has', () => {
    const triggerRect = { top: 600, bottom: 640, left: 0, right: 120 }
    const contentSize = { width: 300, height: 400 }
    const windowSize = { width: 1000, height: 800 }
    const scroll = { top: 0, left: 0 }
    expect(
      getContentBoxStyle(triggerRect, contentSize, windowSize, scroll, NO_SAFE_AREA_INSETS),
    ).toEqual({
      top: '205px', // 600 - 400 + 5
      left: '-5px', // trigger left - 5
      maxHeight: '',
    })
  })

  it('return bottom style including maxHeight when both of the top and the bottom side does not have enough space to display content and the trigger is in the upper side of the screen', () => {
    const triggerRect = { top: 100, bottom: 140, left: 0, right: 120 }
    const contentSize = { width: 300, height: 400 }
    const windowSize = { width: 1000, height: 370 }
    const scroll = { top: 0, left: 0 }
    expect(
      getContentBoxStyle(triggerRect, contentSize, windowSize, scroll, NO_SAFE_AREA_INSETS),
    ).toEqual({
      top: '135px', // 140 - 5
      left: '-5px', // trigger left - 5
      maxHeight: '220px', // 370 - 140 - 10
    })
  })

  it('return top style including maxHeight when both of the top and the bottom side does not have enough space to display content and the trigger is in the lower side of the screen', () => {
    const triggerRect = { top: 200, bottom: 240, left: 0, right: 120 }
    const contentSize = { width: 300, height: 400 }
    const windowSize = { width: 1000, height: 370 }
    const scroll = { top: 0, left: 0 }
    expect(
      getContentBoxStyle(triggerRect, contentSize, windowSize, scroll, NO_SAFE_AREA_INSETS),
    ).toEqual({
      top: '15px', // 0 + 10 + 5
      left: '-5px', // trigger left - 5
      maxHeight: '190px', // 200 - 10
    })
  })

  it('returns left style when the trigger is in the right side of the screen', () => {
    const triggerRect = { top: 100, bottom: 140, left: 500, right: 620 }
    const contentSize = { width: 300, height: 400 }
    const windowSize = { width: 1000, height: 800 }
    const scroll = { top: 0, left: 0 }
    expect(
      getContentBoxStyle(triggerRect, contentSize, windowSize, scroll, NO_SAFE_AREA_INSETS),
    ).toEqual({
      top: '135px', // 140 - 5
      right: '375px', // window width - trigger right - 5
      maxHeight: '',
    })
  })

  it('returns style considering scroll position', () => {
    const triggerRect = { top: 100, bottom: 140, left: 0, right: 120 }
    const contentSize = { width: 300, height: 400 }
    const windowSize = { width: 1000, height: 800 }
    const scroll = { top: 500, left: 600 }
    expect(
      getContentBoxStyle(triggerRect, contentSize, windowSize, scroll, NO_SAFE_AREA_INSETS),
    ).toEqual({
      top: '635px', // 140 - 5 + 500
      left: '595px', // trigger left + scroll left - 5
      maxHeight: '',
    })
  })

  describe('safe area', () => {
    it('returns top style when the content overlaps the bottom safe area', () => {
      // 下側には 800 - 440 = 360px あるが、safe areaを除くと 326px しかない
      const triggerRect = { top: 400, bottom: 440, left: 0, right: 120 }
      const contentSize = { width: 300, height: 330 }
      const windowSize = { width: 1000, height: 800 }
      const scroll = { top: 0, left: 0 }
      expect(
        getContentBoxStyle(triggerRect, contentSize, windowSize, scroll, SAFE_AREA_INSETS),
      ).toEqual({
        top: '75px', // 400 - 330 + 5
        left: '-5px', // trigger left - 5
        maxHeight: '',
      })
    })

    it('return bottom style including maxHeight that does not overlap the bottom safe area', () => {
      const triggerRect = { top: 100, bottom: 140, left: 0, right: 120 }
      const contentSize = { width: 300, height: 400 }
      const windowSize = { width: 1000, height: 370 }
      const scroll = { top: 0, left: 0 }
      expect(
        getContentBoxStyle(triggerRect, contentSize, windowSize, scroll, SAFE_AREA_INSETS),
      ).toEqual({
        top: '135px', // 140 - 5
        left: '-5px', // trigger left - 5
        maxHeight: '186px', // 370 - 34 - 140 - 10
      })
    })

    it('return top style including maxHeight that does not overlap the top safe area', () => {
      const triggerRect = { top: 200, bottom: 240, left: 0, right: 120 }
      const contentSize = { width: 300, height: 400 }
      const windowSize = { width: 1000, height: 370 }
      const scroll = { top: 0, left: 0 }
      expect(
        getContentBoxStyle(triggerRect, contentSize, windowSize, scroll, SAFE_AREA_INSETS),
      ).toEqual({
        top: '74px', // 59 + 10 + 5
        left: '-5px', // trigger left - 5
        maxHeight: '131px', // 200 - 59 - 10
      })
    })

    it('decides the horizontal alignment by the center of the area excluding the safe area', () => {
      // トリガの中心(530)は画面幅の中心(500)より右だが、safe areaを除いた領域の中心(560)より左
      const triggerRect = { top: 100, bottom: 140, left: 460, right: 600 }
      const contentSize = { width: 300, height: 400 }
      const windowSize = { width: 1000, height: 800 }
      const scroll = { top: 0, left: 0 }
      expect(
        getContentBoxStyle(triggerRect, contentSize, windowSize, scroll, {
          top: 0,
          right: 0,
          bottom: 21,
          left: 120,
        }),
      ).toEqual({
        top: '135px', // 140 - 5
        left: '455px', // trigger left - 5
        maxHeight: '',
      })
    })
  })
})
