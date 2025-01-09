import { Analytics } from '@vercel/analytics/react'
import { Providers } from './providers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SimpleSonicSwap',
  description: 'Swap between native Sonic ($S) and wrapped Sonic ($wS) tokens',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  )
} 