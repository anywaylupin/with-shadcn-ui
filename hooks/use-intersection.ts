import { type RefObject, useEffect, useRef, useState } from 'react';

export const useIntersection = (options?: IntersectionObserverInit): [RefObject<HTMLDivElement>, boolean] => {
  const [intersecting, setIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return [ref, intersecting];
};
