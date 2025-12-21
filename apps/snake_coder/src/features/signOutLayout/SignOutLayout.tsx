import Footer from './Footer'
import TopBar from './TopBar'

type SignOutLayoutProps = {
  children: React.ReactNode
}

const SignOutLayout: React.FC<SignOutLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default SignOutLayout
