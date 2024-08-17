import { useEffect, useRef } from 'react';
 
export default function useInterval(callback: VoidFunction, delay: number|null) {
  const savedCallback = useRef<null|VoidFunction>(null);
 
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
 
  useEffect(() => {
    function tick() {
      if (savedCallback.current !== null)
        savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
