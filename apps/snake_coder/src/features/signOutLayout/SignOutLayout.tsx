import Footer from './Footer'
import TopBar from './TopBar'

type SignOutLayoutProps = {
  children: React.ReactNode
}

const SignOutLayout: React.FC<SignOutLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col">
      <TopBar />
      <main className="flex-1 overflow-y-scroll scrollbar-thumb-secondary-500 scrollbar-track-primary-500 scrollbar-thin">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default SignOutLayout
