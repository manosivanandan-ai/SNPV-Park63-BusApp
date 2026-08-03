import { useLocalStorage } from "@/hooks/useLocalStorage";
import { INITIAL_DRIVER } from "@/data/initialData";
import type { Driver } from "@/types";

const STORAGE_KEY = "bus-tracker:driver";

export function useDriver() {
  const [driver, setDriver] = useLocalStorage<Driver>(STORAGE_KEY, INITIAL_DRIVER);
  return { driver, setDriver };
}
