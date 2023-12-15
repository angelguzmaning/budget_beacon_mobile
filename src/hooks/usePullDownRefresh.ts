import { useCallback, useState } from "react";

export function usePullDownRefresh<T>(refetch: () => Promise<T>) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().then(() => setRefreshing(false));
  }, [refetch]);

  return { refreshing, onRefresh };
}
