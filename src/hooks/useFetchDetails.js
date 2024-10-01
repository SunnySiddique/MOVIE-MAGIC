import { useEffect, useState } from "react";
import { APIinstance } from "../main";

const useFetchDetails = (endpoint) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await APIinstance.get(endpoint);
        if (res && res.data) {
          setData(res.data);
        } else {
          throw new Error("No data found");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (endpoint) fetchData();
  }, [endpoint]);

  return { data, isLoading };
};

export default useFetchDetails;
