export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Add authentication check here */}
      {children}
    </>
  )
}
