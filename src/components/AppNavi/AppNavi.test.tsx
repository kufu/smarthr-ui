import { create } from 'react-test-renderer'

import { getIconComponent } from './appNaviHelper'
import { createTheme } from '../../themes/createTheme'
import { FaArchiveIcon } from '../Icon/'

describe('AppNavi', () => {
  describe('getIconComponent', () => {
    const theme = createTheme({
      palette: {
        TEXT_BLACK: 'black',
        TEXT_GREY: 'grey',
      },
    })

    describe('if options does not exist', () => {
      it('should return null', () => {
        expect(getIconComponent(theme)).toBeNull()
      })
    })

    describe('if options exist', () => {
      describe('if icon does not exist', () => {
        it('should return null', () => {
          expect(getIconComponent(theme, {})).toBeNull()
        })
      })

      describe('if icon exist', () => {
        it('svg should be rendered', () => {
          const testInstance = create(getIconComponent(theme, { icon: FaArchiveIcon })!).root
          expect(testInstance.findByType('svg')).toBeTruthy()
        })

        describe('if current is true', () => {
          it('svg color should be TEXT_BLACK color', () => {
            const testInstance = create(
              getIconComponent(theme, { icon: FaArchiveIcon, current: true })!,
            ).root
            expect(testInstance.findByType('svg').props.color).toBe('black')
          })
        })

        describe('if current is false', () => {
          it('svg color should be TEXT_GREY color', () => {
            const testInstance = create(
              getIconComponent(theme, { icon: FaArchiveIcon, current: false })!,
            ).root
            expect(testInstance.findByType('svg').props.color).toBe('grey')
          })
        })
      })
    })
  })
})
