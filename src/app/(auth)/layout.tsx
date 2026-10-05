import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login — Vyat',
  description: 'Sign in to your Vyat account to access your learning dashboard.',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
