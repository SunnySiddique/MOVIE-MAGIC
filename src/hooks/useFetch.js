import { useEffect, useState } from "react";
import { APIinstance } from "../main";

const useFetch = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await APIinstance.get(endpoint);
        setData(res.data.results);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [endpoint]);
  return { data, loading };
};

export default useFetch;
