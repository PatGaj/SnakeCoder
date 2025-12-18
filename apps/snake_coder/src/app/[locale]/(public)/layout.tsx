import { SignOutLayout } from '@/features/signOutLayout'

type LayoutSignOutProps = {
  children: React.ReactNode
}

const LayoutSignOut: React.FC<LayoutSignOutProps> = ({ children }) => {
  return <SignOutLayout>{children}</SignOutLayout>
}

export default LayoutSignOut
