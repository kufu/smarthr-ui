import React, { ComponentProps, ComponentPropsWithRef } from 'react'
import { type FC, type MouseEventHandler } from 'react'

import { Button } from '../../Button'
import { FormControl } from '../../FormControl'
import { Cluster, Stack } from '../../Layout'
import { Fieldset } from '../../NewFieldset'
import { RadioButton } from '../../RadioButton'
import { Section } from '../../SectioningContent'
import { Select } from '../../Select'
import { Dropdown } from '../Dropdown'
import { DropdownCloser } from '../DropdownCloser'
import { DropdownContent } from '../DropdownContent'
import { DropdownScrollArea } from '../DropdownScrollArea'
import { DropdownTrigger } from '../DropdownTrigger'

import { useSortDropdown } from './useSortDropdown'

import type { DecoratorsType } from '../../../types'

type ArgsOnApply = {
  field: string
  order: 'asc' | 'desc'
  newfields: ComponentProps<typeof Select>['options']
}

type Props = {
  /** 並び替え項目 */
  sortFields: ComponentProps<typeof Select>['options']
  /** 並び順の初期値 */
  defaultOrder: 'asc' | 'desc'
  /** 適用時に発火するイベント */
  onApply: (args: ArgsOnApply) => void
  /** キャンセル時に発火するイベント */
  onCancel?: MouseEventHandler<HTMLButtonElement>
  decorators?: DecoratorsType<
    | 'sortFieldLabel'
    | 'sortOrderLabel'
    | 'ascLabel'
    | 'descLabel'
    | 'applyButtonLabel'
    | 'canselButtonLabel'
  >
}
type ElementProps = Omit<ComponentPropsWithRef<'button'>, keyof Props>

export const SortDropdown: FC<Props & ElementProps> = ({
  sortFields,
  defaultOrder,
  onApply,
  onCancel,
  decorators,
  ...props
}) => {
  const {
    labels: {
      triggerLabel,
      sortFieldLabel,
      sortOrderLabel,
      ascLabel,
      descLabel,
      applyButtonLabel,
      canselButtonLabel,
    },
    SortIcon,
    setCheckedInnerOrder,
    innerValues: { innerFields, innerCheckedOrder },
    handler: { handleApply, handleChange },
    styles: { bodyStyle, selectStyle, footerStyle },
  } = useSortDropdown({
    sortFields,
    defaultOrder,
    onApply,
    decorators,
  })

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button {...props} suffix={<SortIcon />}>
          {triggerLabel}
        </Button>
      </DropdownTrigger>
      <DropdownContent controllable>
        <DropdownScrollArea>
          <Section>
            <Stack className={bodyStyle}>
              <FormControl title={sortFieldLabel}>
                <Select
                  name="sortFields"
                  options={innerFields}
                  onChange={handleChange}
                  className={selectStyle}
                />
              </FormControl>
              <Fieldset title={sortOrderLabel} innerMargin={0.5}>
                <Cluster gap={1.25}>
                  <RadioButton
                    name="sortOrder"
                    value="asc"
                    defaultChecked={innerCheckedOrder === 'asc'}
                    onChange={() => setCheckedInnerOrder('asc')}
                  >
                    {ascLabel}
                  </RadioButton>
                  <RadioButton
                    name="sortOrder"
                    value="desc"
                    defaultChecked={innerCheckedOrder === 'desc'}
                    onChange={() => setCheckedInnerOrder('desc')}
                  >
                    {descLabel}
                  </RadioButton>
                </Cluster>
              </Fieldset>
            </Stack>
            <Cluster gap={1} align="center" justify="flex-end" as="footer" className={footerStyle}>
              <DropdownCloser>
                <Button onClick={onCancel}>{canselButtonLabel}</Button>
              </DropdownCloser>
              <DropdownCloser>
                <Button variant="primary" onClick={handleApply}>
                  {applyButtonLabel}
                </Button>
              </DropdownCloser>
            </Cluster>
          </Section>
        </DropdownScrollArea>
      </DropdownContent>
    </Dropdown>
  )
}
