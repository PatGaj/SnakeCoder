import { SideBar } from './sidebar'
import { StatTopBar } from './statTopBar'
import SignInLayoutContent from './SignInLayoutContent'

type SignInLayoutProps = {
  children: React.ReactNode
}

const SignInLayout: React.FC<SignInLayoutProps> = ({ children }) => {
  return (
    <div className="relative flex min-h-screen">
      <StatTopBar />
      <SideBar />
      <SignInLayoutContent>{children}</SignInLayoutContent>
    </div>
  )
}

export default SignInLayout
