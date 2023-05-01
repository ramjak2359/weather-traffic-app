import './globals.css'
import './reset.css'
import { Inter } from 'next/font/google'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = false
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Traffic and Weather App - Govtech',
  description: 'Traffic and Weather App - Govtech',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
