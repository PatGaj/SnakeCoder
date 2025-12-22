import { SignInLayout } from '@/features/signInLayout'

type LayoutSignInProps = {
  children: React.ReactNode
}

const LayoutSignIn: React.FC<LayoutSignInProps> = ({ children }) => {
  return <SignInLayout>{children}</SignInLayout>
}

export default LayoutSignIn
