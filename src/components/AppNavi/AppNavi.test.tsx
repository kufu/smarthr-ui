import { mount } from 'enzyme'

import { getIconComponent } from './appNaviHelper'
import { createTheme } from '../../themes/createTheme'

describe('AppNavi', () => {
  describe('getIconComponent', () => {
    const theme = createTheme({
      palette: {
        TEXT_BLACK: 'black',
        TEXT_GREY: 'grey',
        TEXT_DISABLED: 'white',
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
          const component = mount(getIconComponent(theme, { icon: 'fa-archive' })!)
          expect(component.exists('svg')).toBeTruthy()
        })

        describe('if current is true', () => {
          const component = mount(getIconComponent(theme, { icon: 'fa-archive', current: true })!)

          it('svg color should be TEXT_BLACK color', () => {
            expect(component.find('svg').props().color).toBe('black')
          })
        })

        describe('if current is false', () => {
          describe('if disabled is true', () => {
            const component = mount(
              getIconComponent(theme, { icon: 'fa-archive', current: false, disabled: true })!,
            )

            it('svg color should be TEXT_DISABLED color', () => {
              expect(component.find('svg').props().color).toBe('white')
            })
          })

          describe('if disabled is flase', () => {
            const component = mount(
              getIconComponent(theme, { icon: 'fa-archive', current: false, disabled: false })!,
            )

            it('svg color should be TEXT_GREY color', () => {
              expect(component.find('svg').props().color).toBe('grey')
            })
          })
        })
      })
    })
  })
})
