import { SideBar } from './sidebar'
import { StatTopBar } from './statTopBar'
import SignInLayoutContent from './SignInLayoutContent'

type SignInLayoutProps = {
  children: React.ReactNode
}

const SignInLayout: React.FC<SignInLayoutProps> = ({ children }) => {
  return (
    <div className="relative flex min-h-screen flex-col">
      <StatTopBar />
      <div className="flex min-h-0 flex-1">
        <SideBar />
        <SignInLayoutContent>{children}</SignInLayoutContent>
      </div>
    </div>
  )
}

export default SignInLayout
