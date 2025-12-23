import { SideBar } from '../sidebar'

type SignInLayoutProps = {
  children: React.ReactNode
}

const SignInLayout: React.FC<SignInLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="min-w-0 flex-1 h-full overflow-y-scroll scrollbar-thumb-secondary-500 scrollbar-track-primary-500 scrollbar-thin">
        {children}
      </div>
    </div>
  )
}

export default SignInLayout
