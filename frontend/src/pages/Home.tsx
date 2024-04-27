import axios from "axios";
import { useEffect, useState } from "react";

const Home = () => {
  // TODO: remove this
  const [responseData, setResponseData] = useState<any>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/v1/protected", {
        withCredentials: true,
      })
      .then((response) => {
        setResponseData(response.data);
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  }, []);

  return (
    <div>
      <div>Home</div>
      {responseData && (
        <div>Response from server: {JSON.stringify(responseData)}</div>
      )}
    </div>
  );
};

export default Home;
