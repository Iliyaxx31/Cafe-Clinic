// app/layout.js
export const metadata = {

  title: 'کلینیک دکتر کرد ',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body style={{ margin: 0, padding: 0, background: '#F5F7FA' }}>
        {children}
      </body>
    </html>
  )
}