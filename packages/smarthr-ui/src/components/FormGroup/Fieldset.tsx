'use client'

import { type FC, type ReactNode, useId, useRef } from 'react'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'

import { FormGroup } from './FormGroup'

import type { CommonProps, ObjectLabelType } from './type'

const legendObjectConverter = (legend: ReactNode) => ({ text: legend })

export const Fieldset: FC<
  CommonProps & {
    legend: ReactNode | Omit<ObjectLabelType, 'htmlFor'>
    /** `true` のとき、文字色を `TEXT_DISABLED` にする */
    disabled?: boolean
  }
> = ({ legend: orgLegend, ...rest }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const baseId = useId()

  const baseLegend = useObjectAttributes<ReactNode | ObjectLabelType, ObjectLabelType>(
    orgLegend,
    legendObjectConverter,
  )
  const legend = {
    ...baseLegend,
    // HINT: Fieldsetなので本質的にhtmlForは不要なのだがhtmlForを使って
    // 最初のinputと各種ヒントをaria-describedbyでつなげているため必要
    htmlFor: `${baseId}-htmlFor`,
    id: baseLegend.id || `${baseId}-legend`,
  }

  return <FormGroup {...rest} as="fieldset" wrapperRef={wrapperRef} label={legend} />
}
