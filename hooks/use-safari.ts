import { useEffect, useState } from 'react';

export const useSafari = (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    setIsSafari(
      typeof window !== 'undefined' &&
        navigator.userAgent.includes('Safari') &&
        !navigator.userAgent.includes('Chrome') &&
        /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    );
  }, []);

  return [isSafari, setIsSafari];
};
