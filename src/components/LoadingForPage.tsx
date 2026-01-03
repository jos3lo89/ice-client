import { GridLoader } from "react-spinners";

const LoadingForPage = () => {
  return (
    <div className="py-20 flex items-center justify-center">
      <GridLoader color="#36d7b7" loading size={20} />
    </div>
  );
};
export default LoadingForPage;
