import { tv } from 'tailwind-variants'

export const classNameGenerator = tv({
  slots: {
    wrapper: [
      'smarthr-ui-DropZone',
      'shr-relative',
      'shr-border-shorthand shr-flex shr-flex-col shr-items-center shr-justify-center shr-bg-column shr-p-2.5',
    ],
    button: '',
  },
  variants: {
    filesDraggedOver: {
      true: {
        wrapper: 'shr-border-main',
      },
      false: {
        wrapper: 'shr-border-dashed',
      },
    },
    disabled: {
      true: {
        wrapper: 'shr-cursor-not-allowed',
      },
    },
    error: {
      true: {
        button: 'shr-border-danger',
      },
    },
  },
})
