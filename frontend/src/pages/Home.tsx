import { useEffect, useState } from "react";
import SideNav from "../Components/Sidenav";
import axiosInstance from "../utils/axiosInstance";

const Home = () => {
  // TODO: remove this
  const [responseData, setResponseData] = useState<any>(null);

  useEffect(() => {
    axiosInstance
      .get("/protected")
      .then((response) => {
        setResponseData(response.data);
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  }, []);

  return (
    <div>
      {/* <div>Home</div> */}
      <SideNav/>
      {responseData && (
        <div>Response from server: {JSON.stringify(responseData)}</div>
      )}
    </div>
  );
};

export default Home;
