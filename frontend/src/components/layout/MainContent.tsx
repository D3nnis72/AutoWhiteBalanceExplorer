/** Main content wrapper component. */

import { ReactNode } from 'react';

export interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return (
    <main className="container mx-auto flex-1 px-4 py-8">
      {children}
    </main>
  );
}

