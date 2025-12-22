import { SideBar } from '../sidebar'

type SignInLayoutProps = {
  children: React.ReactNode
}

const SignInLayout: React.FC<SignInLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

export default SignInLayout
