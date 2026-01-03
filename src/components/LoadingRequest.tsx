import { BarLoader } from "react-spinners";
const LoadingRequest = () => {
  return (
    <div className="py-10 flex items-center justify-center">
      <BarLoader color="#36d7b7" loading />
    </div>
  );
};
export default LoadingRequest;
