import { Providers } from './providers'

export const metadata = {
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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
} 