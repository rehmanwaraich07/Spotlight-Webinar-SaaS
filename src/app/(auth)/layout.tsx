type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="w-full flex min-h-screen items-center justify-center">
      {children}
    </div>
  );
};

export default Layout;
