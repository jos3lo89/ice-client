import { ModeToggle } from "@/components/theme/mode-toggle";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <header className="flex justify-end p-4">
        <ModeToggle />
      </header>
      <Outlet />
    </>
  );
};
export default AuthLayout;
