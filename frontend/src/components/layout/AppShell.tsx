/** App shell layout component. */

import { ReactNode } from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { MainContent } from './MainContent';

export interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <MainContent>{children}</MainContent>
      <Footer />
    </div>
  );
}

