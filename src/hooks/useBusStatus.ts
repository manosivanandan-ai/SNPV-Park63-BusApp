import { useLocalStorage } from "@/hooks/useLocalStorage";
import { INITIAL_BUS_STATUS } from "@/data/initialData";
import type { BusStatusValue } from "@/types";

const STORAGE_KEY = "bus-tracker:bus-status";

export function useBusStatus() {
  const [status, setStatus] = useLocalStorage<BusStatusValue>(STORAGE_KEY, INITIAL_BUS_STATUS);
  return { status, setStatus };
}
