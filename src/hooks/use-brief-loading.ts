import { useEffect, useState } from "react";

/** Brief skeleton window so route transitions never flash bare content. */
export function useBriefLoading(ms = 320) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
}
