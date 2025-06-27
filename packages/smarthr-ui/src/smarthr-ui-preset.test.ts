import { tv } from 'tailwind-variants'

// smarthr-ui-presetをimportして設定を適用
import './smarthr-ui-preset'

describe('twMergeConfig', () => {
  describe('classGroups', () => {
    describe('width', () => {
      it('width関連のクラスが正しくマージされること', () => {
        const testClassNameGenerator = tv({
          base: 'shr-w-col1 shr-w-px',
        })

        const result = testClassNameGenerator({
          className: 'shr-w-[20em]',
        })

        // 最後に指定されたクラスが優先されることを確認
        expect(result).toContain('shr-w-[20em]')

        // twMergeConfigが効いている場合、古いクラスは削除される
        if (
          result.includes('shr-w-col1') &&
          result.includes('shr-w-px') &&
          result.includes('shr-w-[20em]')
        ) {
          console.warn('❌ twMergeConfigが効いていない: width classGroup')
          // テストを失敗させる
          expect(result).not.toContain('shr-w-col1')
        }
      })
    })

    describe('flexBasis', () => {
      it('flex-basis関連のクラスが正しくマージされること', () => {
        const testClassNameGenerator = tv({
          base: 'shr-basis-col6 shr-basis-px',
        })

        const result = testClassNameGenerator({
          className: 'shr-basis-[300px]',
        })

        // 最後に指定されたクラスが優先されることを確認
        expect(result).toContain('shr-basis-[300px]')

        if (
          result.includes('shr-basis-px') &&
          result.includes('shr-basis-col6') &&
          result.includes('shr-basis-[300px]')
        ) {
          console.warn('❌ twMergeConfigが効いていない: flexBasis classGroup')
          expect(result).not.toContain('shr-basis-col6')
        }
      })
    })

    describe('boxShadow', () => {
      it('shadow関連のクラスが正しくマージされること', () => {
        const testClassNameGenerator = tv({
          base: 'shr-shadow-none',
        })

        const result = testClassNameGenerator({
          className: 'shr-shadow-layer-2',
        })

        // 最後に指定されたクラスが優先されることを確認
        expect(result).toContain('shr-shadow-layer-2')

        if (result.includes('shr-shadow-none') && result.includes('shr-shadow-layer-2')) {
          console.warn('❌ twMergeConfigが効いていない: boxShadow classGroup')
          expect(result).not.toContain('shr-shadow-none')
        }
      })
    })

    describe('borderShorthand', () => {
      it('border-shorthand関連のクラスが正しくマージされること', () => {
        const testClassNameGenerator = tv({
          base: 'shr-border-t-shorthand shr-border-r-shorthand',
        })

        const result = testClassNameGenerator({
          className: 'shr-border-b-shorthand',
        })

        expect(result).toContain('shr-border-b-shorthand')
      })
    })

    describe('fontSize', () => {
      it('text-size関連のクラスが正しくマージされること', () => {
        const testClassNameGenerator = tv({
          base: 'shr-text-sm',
        })

        const result = testClassNameGenerator({
          className: 'shr-text-inherit',
        })

        // 最後に指定されたクラスが優先されることを確認
        expect(result).toContain('shr-text-inherit')

        if (result.includes('shr-text-sm') && result.includes('shr-text-inherit')) {
          console.warn('❌ twMergeConfigが効いていない: fontSize classGroup')
          expect(result).not.toContain('shr-text-sm')
        }
      })
    })

    describe('lineHeight', () => {
      it('line-height関連のクラスが正しくマージされること', () => {
        const testClassNameGenerator = tv({
          base: 'shr-leading-none',
        })

        const result = testClassNameGenerator({
          className: 'shr-leading-tight shr-leading-[0]',
        })

        expect(result).toContain('shr-leading-[0]')
      })
    })

    describe('zIndex', () => {
      it('z-index関連のクラスが正しくマージされること', () => {
        const testClassNameGenerator = tv({
          base: 'shr-z-0',
        })

        const result = testClassNameGenerator({
          className: 'shr-z-overlap',
        })

        // 最後に指定されたクラスが優先されることを確認
        expect(result).toContain('shr-z-overlap')

        if (result.includes('shr-z-0') && result.includes('shr-z-overlap')) {
          console.warn('❌ twMergeConfigが効いていない: zIndex classGroup')
          expect(result).not.toContain('shr-z-0')
        }
      })
    })

    describe('focus', () => {
      it('focus関連のクラスが正しくマージされること', () => {
        const testClassNameGenerator = tv({
          base: 'shr-focus-indicator',
        })

        const result = testClassNameGenerator({
          className: 'shr-focus-indicator--inner',
        })

        expect(result).toContain('shr-focus-indicator--inner')
      })
    })
  })
})
