import Footer from './Footer'
import TopBar from './TopBar'

type SignOutLayoutProps = {
  children: React.ReactNode
}

const SignOutLayout: React.FC<SignOutLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="flex flex-col">
        <TopBar />
        <div className='flex-1'>{children}</div>
        <Footer />
      </div>
    </>
  )
}

export default SignOutLayout
