import { RouterProvider } from "react-router-dom";
import { router } from "./routers/router";

const IceApp = () => {
  return <RouterProvider router={router} />;
};
export default IceApp;
