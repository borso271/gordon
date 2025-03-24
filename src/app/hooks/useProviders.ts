import { useEffect, useState } from "react";
import { Provider } from "../../interfaces"; // adjust path

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("/providers.json");
        const data: Provider[] = await response.json();
        setProviders(data.slice(0, 3));
      } catch (err: any) {
        console.error("Error loading providers:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  return { providers, loading, error };
}
