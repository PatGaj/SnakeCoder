"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

type ProviderWrapperProps = {
  children: ReactNode;
};

export const ProviderWrapper: React.FC<ProviderWrapperProps> = ({ children}) => {
  return <SessionProvider>{children}</SessionProvider>;
};
