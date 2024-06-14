import { useMemo } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'

import { type Gap } from '../../types'

const dialogContentInner = tv({
  slots: {
    titleArea: ['smarthr-ui-Dialog-titleArea', 'shr-border-b-shorthand shr-px-1.5 shr-py-1'],
    actionArea: ['smarthr-ui-Dialog-actionArea', 'shr-border-t-shorthand shr-px-1.5 shr-py-1'],
    buttonArea: ['smarthr-ui-Dialog-buttonArea', 'shr-ms-auto'],
    message: 'shr-text-right',
  },
})
const dialogBody = tv({
  base: ['smarthr-ui-Dialog-body', 'shr-overflow-auto'],
  variants: {
    contentPaddingBlock: {
      0: 'shr-py-0',
      0.25: 'shr-py-0.25',
      0.5: 'shr-py-0.5',
      0.75: 'shr-py-0.75',
      1: 'shr-py-1',
      1.25: 'shr-py-1.25',
      1.5: 'shr-py-1.5',
      2: 'shr-py-2',
      2.5: 'shr-py-2.5',
      3: 'shr-py-3',
      3.5: 'shr-py-3.5',
      4: 'shr-py-4',
      8: 'shr-py-8',
      X3S: 'shr-py-0.25',
      XXS: 'shr-py-0.5',
      XS: 'shr-py-1',
      S: 'shr-py-1.5',
      M: 'shr-py-2',
      L: 'shr-py-2.5',
      XL: 'shr-py-3',
      XXL: 'shr-py-3.5',
      X3L: 'shr-py-4',
    } as { [key in Gap]: string },
    contentPaddingInline: {
      0: 'shr-px-0',
      0.25: 'shr-px-0.25',
      0.5: 'shr-px-0.5',
      0.75: 'shr-px-0.75',
      1: 'shr-px-1',
      1.25: 'shr-px-1.25',
      1.5: 'shr-px-1.5',
      2: 'shr-px-2',
      2.5: 'shr-px-2.5',
      3: 'shr-px-3',
      3.5: 'shr-px-3.5',
      4: 'shr-px-4',
      8: 'shr-px-8',
      X3S: 'shr-px-0.25',
      XXS: 'shr-px-0.5',
      XS: 'shr-px-1',
      S: 'shr-px-1.5',
      M: 'shr-px-2',
      L: 'shr-px-2.5',
      XL: 'shr-px-3',
      XXL: 'shr-px-3.5',
      X3L: 'shr-px-4',
    } as { [key in Gap]: string },
    contentBgColor: {
      BACKGROUND: 'shr-bg-background',
      COLUMN: 'shr-bg-column',
      BASE_GREY: 'shr-bg-base-grey',
      OVER_BACKGROUND: 'shr-bg-over-background',
      HEAD: 'shr-bg-head',
      BORDER: 'shr-bg-[theme(colors.grey.20)]',
      ACTION_BACKGROUND: 'shr-bg-action-background',
      WHITE: 'shr-bg-white',
      GREY_5: 'shr-bg-[theme(colors.grey.5)]',
      GREY_6: 'shr-bg-[theme(colors.grey.6)]',
      GREY_7: 'shr-bg-[theme(colors.grey.7)]',
      GREY_9: 'shr-bg-[theme(colors.grey.9)]',
      GREY_20: 'shr-bg-[theme(colors.grey.20)]',
    },
  },
})

export type ContentBodyProps = Pick<VariantProps<typeof dialogBody>, 'contentBgColor'> & {
  contentPadding?: Gap | { block?: Gap; inline?: Gap }
}

export const useDialoginnerStyle = (
  offsetHeight: number,
  bgColor: ContentBodyProps['contentBgColor'],
  padding: ContentBodyProps['contentPadding'] = 1.5,
) =>
  useMemo(() => {
    const { titleArea, actionArea, buttonArea, message } = dialogContentInner()
    const paddingBlock = padding instanceof Object ? padding.block : padding
    const paddingInline = padding instanceof Object ? padding.inline : padding

    return {
      titleAreaStyle: titleArea(),
      bodyStyleProps: {
        className: dialogBody({
          contentBgColor: bgColor,
          contentPaddingBlock: paddingBlock,
          contentPaddingInline: paddingInline,
        }),
        style: {
          maxHeight: `calc(100svh - ${offsetHeight}px)`,
        },
      },
      actionAreaStyle: actionArea(),
      buttonAreaStyle: buttonArea(),
      messageStyle: message(),
    }
  }, [bgColor, offsetHeight, padding])
