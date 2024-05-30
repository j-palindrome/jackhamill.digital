import { formatColor } from '@/sanity/lib/color'
import { sanityFetch } from '@/sanity/lib/fetch'
import { settingsQuery } from '@/sanity/queries'
import { SettingsQueryResult } from '@/sanity/sanity-types'
import type { Metadata } from 'next'
import { VisualEditing } from 'next-sanity'
import { draftMode } from 'next/headers'
import NavBar from './NavBar'
import './globals.css'

export const runtime = 'edge'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const data = await sanityFetch<SettingsQueryResult>({ query: settingsQuery })

  const style = {
    '--bg': formatColor(data?.backgroundColor!),
    '--bg2': formatColor(data?.backgroundAltColor!),
    '--fg': formatColor(data?.foregroundColor!),
    '--accent': formatColor(data?.accentColor!),
    '--accent2': formatColor(data?.accentAltColor!),
    '--body': `${data?.bodyFont?.name}`,
    '--heading': `${data?.headingFont?.name}`,
    '--topbar': '60px'
  } as React.CSSProperties

  return (
    <html lang='en' style={style}>
      <head>
        {data?.bodyFont?.linkSource && (
          <link rel='stylesheet' href={data.bodyFont!.linkSource} />
        )}
        {data?.headingFont?.linkSource && (
          <link rel='stylesheet' href={data.headingFont!.linkSource} />
        )}
      </head>
      <body className={`bg-bg font-body text-fg`}>
        <NavBar title={data?.siteTitle ?? 'My Site'} />
        {draftMode().isEnabled && (
          <div>
            <a className='p-4 bg-blue-300 block' href='/api/disable-draft'>
              Disable preview mode
            </a>
          </div>
        )}
        {children}
        {draftMode().isEnabled && <VisualEditing />}
      </body>
    </html>
  )
}
