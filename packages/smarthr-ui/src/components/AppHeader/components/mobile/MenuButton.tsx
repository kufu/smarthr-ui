import { type PropsWithChildren, memo, useMemo } from 'react'

import { Button } from '../../../Button'
import { FaAngleRightIcon } from '../../../Icon'
import { commonButtonClassNameGenerator } from '../common/CommonButton'
import { Translate } from '../common/Translate'

type Props = PropsWithChildren<{
  onClick: () => void
  isCurrent?: boolean
}>

export const MenuButton = memo<Props>(({ children, onClick, isCurrent }) => {
  const buttonClassName = useMemo(
    () =>
      commonButtonClassNameGenerator({
        current: isCurrent,
        boldWhenCurrent: true,
        className: '[&&]:shr-justify-between [&&]:shr-px-0.5',
      }),
    [isCurrent],
  )

  return (
    <Button type="button" onClick={onClick} className={buttonClassName}>
      <Translate>{children}</Translate>
      <FaAngleRightIcon color="TEXT_BLACK" />
    </Button>
  )
})
