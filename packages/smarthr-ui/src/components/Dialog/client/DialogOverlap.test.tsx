import { act, fireEvent, render, screen } from '@testing-library/react'
import { type FC, useLayoutEffect, useState } from 'react'

import { DialogOverlap } from './DialogOverlap'

describe('DialogOverlap', () => {
  const Probe: FC<{ value: string; log: string[] }> = ({ value, log }) => {
    useLayoutEffect(() => {
      log.push(value)
    })

    return <span data-testid="probe">{value}</span>
  }

  const Template: FC<{ log: string[] }> = ({ log }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [value, setValue] = useState('initial')

    return (
      <>
        <button type="button" onClick={() => setIsOpen(true)}>
          open
        </button>
        <button type="button" onClick={() => setIsOpen(false)}>
          close
        </button>
        <button type="button" onClick={() => setValue('edited')}>
          edit
        </button>
        <button type="button" onClick={() => setValue('after closed')}>
          edit after closed
        </button>
        <button
          type="button"
          onClick={() => {
            setValue('closing')
            setIsOpen(false)
          }}
        >
          edit and close
        </button>
        <DialogOverlap isOpen={isOpen}>
          <Probe value={value} log={log} />
        </DialogOverlap>
      </>
    )
  }

  const openAndEdit = () => {
    fireEvent.click(screen.getByRole('button', { name: 'open' }))
    fireEvent.click(screen.getByRole('button', { name: 'edit' }))
  }

  it('閉じた直後の描画から、閉じる直前の children で描画されること', async () => {
    const log: string[] = []
    render(<Template log={log} />)
    openAndEdit()
    log.length = 0

    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    await act(async () => {})

    expect(new Set(log)).toEqual(new Set(['edited']))
    expect(screen.getByTestId('probe')).toHaveTextContent('edited')
  })

  it('閉じるのと同じイベント内での children の変更は反映されること', async () => {
    const log: string[] = []
    render(<Template log={log} />)
    openAndEdit()
    log.length = 0

    fireEvent.click(screen.getByRole('button', { name: 'edit and close' }))
    await act(async () => {})

    expect(new Set(log)).toEqual(new Set(['closing']))
  })

  it('閉じた後の children の変更は反映されないこと', async () => {
    const log: string[] = []
    render(<Template log={log} />)
    openAndEdit()
    fireEvent.click(screen.getByRole('button', { name: 'close' }))
    await act(async () => {})

    fireEvent.click(screen.getByRole('button', { name: 'edit after closed' }))
    await act(async () => {})

    expect(screen.getByTestId('probe')).toHaveTextContent('edited')
  })
})
