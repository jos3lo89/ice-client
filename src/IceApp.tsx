import { RouterProvider } from "react-router-dom";
import { router } from "./routers/router";
import EnvDebug from "./components/EnvDebug";

const IceApp = () => {
  return (
    <>
      <RouterProvider router={router} />
      <EnvDebug />
    </>
  );
};
export default IceApp;
