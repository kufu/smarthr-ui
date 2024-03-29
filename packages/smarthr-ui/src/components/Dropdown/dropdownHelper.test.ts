import { getContentBoxStyle } from './dropdownHelper'

describe('dropdownHelper', () => {
  describe('getConetentBoxStyle', () => {
    it('returns bottom style when the bottom side of the trigger has enough space to display content', () => {
      const triggerRect = { top: 100, bottom: 140, left: 0, right: 120 }
      const contentSize = { width: 300, height: 400 }
      const windowSize = { width: 1000, height: 800 }
      const scroll = { top: 0, left: 0 }
      expect(getContentBoxStyle(triggerRect, contentSize, windowSize, scroll)).toEqual({
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
      expect(getContentBoxStyle(triggerRect, contentSize, windowSize, scroll)).toEqual({
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
      expect(getContentBoxStyle(triggerRect, contentSize, windowSize, scroll)).toEqual({
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
      expect(getContentBoxStyle(triggerRect, contentSize, windowSize, scroll)).toEqual({
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
      expect(getContentBoxStyle(triggerRect, contentSize, windowSize, scroll)).toEqual({
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
      expect(getContentBoxStyle(triggerRect, contentSize, windowSize, scroll)).toEqual({
        top: '635px', // 140 - 5 + 500
        left: '595px', // trigger left + scroll left - 5
        maxHeight: '',
      })
    })
  })
})
