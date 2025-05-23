import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { StoreProvider } from './redux/StoreProvider'
import { ThemeProvider } from 'next-themes'
import { LoadingProvider } from '@/context/LoadingContext'
import GlobalLoading from '@/components/GlobalLoading'
import RefreshToken from './auth/_component/RefreshToken'
import Script from 'next/script'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900'
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900'
})

export const metadata: Metadata = {
  title: 'PATO - Trang Quản Lý Nhà Hàng',
  description: 'Trang quản lý nội bộ dành cho nhân viên và quản lý của nhà hàng PATO tại Lục Nam, Bắc Giang.',
  keywords: 'quản lý nhà hàng, dashboard PATO, quản trị nhân viên, thống kê doanh thu, quản lý đặt bàn, admin PATO',
  robots: 'noindex, nofollow',
  openGraph: {
    title: 'PATO - Trang Quản Lý Nhà Hàng',
    description: 'Khu vực quản trị nội bộ dành cho nhân viên và quản lý PATO.',
    url: 'https://restaurant.pg.taphoaictu.id.vn/',
    siteName: 'PATO Admin Dashboard',
    images: [
      {
        url: 'https://res.cloudinary.com/dkjasvlw6/image/upload/v1741005120/default/jjkajlyw8vrdtdg7ut06.webp',
        width: 1200,
        height: 630,
        alt: 'PATO - Trang quản lý nhà hàng'
      }
    ],
    locale: 'vi_VN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PATO - Trang Quản Lý Nhà Hàng',
    description: 'Giao diện quản trị nội bộ dành cho nhân viên PATO tại Bắc Giang.',
    images: ['https://res.cloudinary.com/dkjasvlw6/image/upload/v1741005120/default/jjkajlyw8vrdtdg7ut06.webp']
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0
}


export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <head>
        <meta charSet="utf-8" />
        <meta name="author" content="PATO Nhà Hàng Nướng & Lẩu" />
        <meta name="theme-color" content="#ff5a3c" />
        <link rel="icon" href="/logo.ico" />
        <link rel="canonical" href="https://restaurant.pg.taphoaictu.id.vn/" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="geo.region" content="VN-BG" />
        <meta name="geo.placename" content="TT Đồi Ngô, Lục Nam, Bắc Giang" />
        <meta name="language" content="vi" />

        {/* Structured Data for Admin Page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "PATO - Trang Quản Lý Nhà Hàng",
              "description": "Trang quản lý nội bộ dành cho nhân viên và quản lý của nhà hàng PATO tại Lục Nam, Bắc Giang.",
              "url": "https://restaurant.pg.taphoaictu.id.vn/",
              "inLanguage": "vi",
              "isPartOf": {
                "@type": "WebSite",
                "name": "PATO Nhà Hàng",
                "url": "https://pato.taphoaictu.id.vn"
              }
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StoreProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <LoadingProvider>
              <GlobalLoading />
              <Toaster />
              {/* <RefreshToken /> */}
              {children}
            </LoadingProvider>
          </ThemeProvider>
        </StoreProvider>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-47R5H7EEX9" strategy="afterInteractive" />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-47R5H7EEX9');
            `
          }}
        />
      </body>
    </html>
  )
}
