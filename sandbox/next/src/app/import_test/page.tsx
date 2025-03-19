'use client'

// samrthr-ui.css がimportできるかどうかのテスト
import 'smarthr-ui/smarthr-ui.css'

// libs以下のimportができるかどうかのテスト
import { useHandleEscape } from 'smarthr-ui/lib/hooks/useHandleEscape'

export default function About() {
  useHandleEscape()
  return (
    <main>
      OK
    </main>
  )
}
