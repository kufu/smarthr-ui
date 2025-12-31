import { EnvironmentProvider, IntlProvider } from 'smarthr-ui'
import './global.css'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <IntlProvider locale="ja">
      <EnvironmentProvider>
        <html lang="en">
          <body>{children}</body>
        </html>
      </EnvironmentProvider>
    </IntlProvider>
  )
}
