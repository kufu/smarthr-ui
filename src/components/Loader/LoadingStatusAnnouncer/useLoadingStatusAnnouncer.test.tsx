import React, { act, renderHook, screen } from '@testing-library/react'

import { LoadingAnnouncerProvider, useLoadingAnnouncer } from '.'

describe('useLoadingStatusAnnouncer', () => {
  test('it handles loading status', async () => {
    const { result, unmount } = renderHook(() => useLoadingAnnouncer(), {
      wrapper: ({ children }) => <LoadingAnnouncerProvider>{children}</LoadingAnnouncerProvider>,
    })

    expect(screen.getByRole('status', { name: '' })).toBeInTheDocument()

    act(() => result.current.kickoff({ message: '読み込み中' }))
    expect(screen.getByText('読み込み中')).toBeInTheDocument()

    act(() => result.current.resolve({ message: '完了' }))
    expect(screen.getByText('完了')).toBeInTheDocument()

    unmount()
  })

  test('it handles failure status', () => {
    const { result, unmount } = renderHook(() => useLoadingAnnouncer(), {
      wrapper: ({ children }) => <LoadingAnnouncerProvider>{children}</LoadingAnnouncerProvider>,
    })

    expect(screen.getByRole('status', { name: '' })).toBeInTheDocument()

    act(() => result.current.kickoff({ message: '読み込み中' }))
    expect(screen.getByText('読み込み中')).toBeInTheDocument()

    act(() => result.current.reject({ message: '失敗' }))
    expect(screen.getByText('失敗')).toBeInTheDocument()

    unmount()
  })
})
