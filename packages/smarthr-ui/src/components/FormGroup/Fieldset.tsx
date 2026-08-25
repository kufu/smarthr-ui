import { type FC, type ReactNode, useId, useRef } from 'react'

import { useObjectAttributes } from '../../hooks/useObjectAttributes'

import { FormGroup } from './FormGroup'

import type { CommonProps, ObjectLabelType } from './type'

const legendObjectConverter = (label: ReactNode) => ({ text: label })

export const Fieldset: FC<
  CommonProps & {
    legend: ReactNode | ObjectLabelType
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
    // TODO: fieldsetなので本質的にhtmlForは不要なはず。調整する
    htmlFor: baseLegend.htmlFor || `${baseId}-htmlFor`,
    id: baseLegend.id || `${baseId}-label`,
  }

  return <FormGroup {...rest} as="fieldset" wrapperRef={wrapperRef} label={legend} />
}
