"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";

type ProvidersWrapperProps = {
  children: React.ReactNode;
  locale: string;
};

const queryClient = new QueryClient();

export const ProviderWrapper: React.FC<ProvidersWrapperProps> = ({ children, locale }) => {
  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale}>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </NextIntlClientProvider>
    </SessionProvider>
  );
};
