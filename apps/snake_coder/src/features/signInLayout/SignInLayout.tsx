import { SideBar } from './sidebar'
import { StatTopBar } from './statTopBar'

type SignInLayoutProps = {
  children: React.ReactNode
}

const SignInLayout: React.FC<SignInLayoutProps> = ({ children }) => {
  return (
    <div className="relative flex min-h-screen">
      <StatTopBar />
      <SideBar />
      <div className="min-w-0 flex-1 h-screen overflow-y-auto scrollbar-thumb-secondary-500 scrollbar-track-primary-500 scrollbar-thin">
        {children}
      </div>
    </div>
  )
}

export default SignInLayout
