const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <div className="grid place-items-center h-auto mt-10">{children}</div>;
};
export default AuthLayout;
