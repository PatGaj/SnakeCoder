type SignOutLayoutProps = {
  children: React.ReactNode
}

const SignOutLayout: React.FC<SignOutLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="bg-linear-to-br from-primary-950 via-primary-800 to-primary-900 min-h-screen">{children}</div>
      <div className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-secondary-500/15 blur-3xl" />
    </>
  )
}

export default SignOutLayout
