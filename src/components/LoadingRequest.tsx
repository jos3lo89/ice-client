import { BarLoader } from "react-spinners";
const LoadingRequest = () => {
  return (
    <div className="p-12 flex items-center justify-center">
      <BarLoader color="#36d7b7" loading />
    </div>
  );
};
export default LoadingRequest;