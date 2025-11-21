'use client'
import '@/styles/spotify.css'
import InputBar from '../components/InputBar'
import LogoBar from '../components/LogoBar'

export default function Page(){
  return (
    <html lang="en">
      <body>
        <div>
          <LogoBar />
          <InputBar />
        </div>
      </body>
    </html>
  )
}