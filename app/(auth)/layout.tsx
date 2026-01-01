/**
 * Auth Layout - No navbar or footer for clean auth screens
 * This layout wraps sign-in, sign-up, and password reset pages
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

