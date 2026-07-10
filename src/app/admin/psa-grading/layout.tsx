import GradingAdminLayoutClient from './GradingAdminLayoutClient';

export default function PsaGradingAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GradingAdminLayoutClient>{children}</GradingAdminLayoutClient>;
}
