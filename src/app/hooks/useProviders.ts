import { useEffect, useState } from "react";
import { Provider } from "../../interfaces"; // adjust path
import { useLanguage } from "./useLanguage";

export function useProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentLang } = useLanguage();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const lang = currentLang === "en" ? "en" : "ar";
        const response = await fetch(`/providers_${lang}.json`);
        if (!response.ok) {
          throw new Error(`Failed to fetch providers_${lang}.json`);
        }
        const data: Provider[] = await response.json();
        setProviders(data.slice(0, 3));
      } catch (err: any) {
        console.error("Error loading providers:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [currentLang]);

  return { providers, loading, error };
}

// export function useProviders() {
//   const [providers, setProviders] = useState<Provider[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const { currentLang } = useLanguage();
//   useEffect(() => {
//     const fetchProviders = async () => {
//       try {
//         const response = await fetch("/providers.json");
//         const data: Provider[] = await response.json();
//         setProviders(data.slice(0, 3));
//       } catch (err: any) {
//         console.error("Error loading providers:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProviders();
//   }, []);

//   return { providers, loading, error };
// }
