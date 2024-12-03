export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode
  params: Promise<{
    locale: string
    post: string
  }>
}) {
  return (
    <>
      {/* <Header /> */}
      {children}
      {/* <Footer /> */}
    </>
  )
}
