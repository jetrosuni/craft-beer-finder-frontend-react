import debounce from "lodash.debounce";
import { useEffect, useMemo, useRef } from "react";

export const useDebounce = (callback: () => void) => {
  const ref = useRef<typeof callback>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, 320);
  }, []);

  return debouncedCallback;
};
