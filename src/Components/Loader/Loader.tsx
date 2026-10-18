
import { Oval } from "react-loader-spinner";

export default function Loader() {
  return (
    <div className="absolute inset-0 h-screen w-full bg-amber-100  flex justify-center items-center ">
      <Oval
        visible={true}
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}
