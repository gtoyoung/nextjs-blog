import { useState, useEffect, useCallback } from "react";
import { NaraApi } from "services/nara";

const useFecth = (page: number) => {
  const [list, setList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const api = new NaraApi();
  const sendQuery = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.getHospitals(10, page);
      console.log(res);
      setList((prev) => [...new Set([...prev, ...res])]);
      setHasMore(res.length === 10);
      setIsLoading(false);
    } catch (e) {
      throw new Error(`오류입니다. ${e.message}`);
    }
  }, [page]);

  useEffect(() => {
    sendQuery();
  }, [sendQuery, page]);

  return { hasMore, list, isLoading };
};

export default useFecth;
