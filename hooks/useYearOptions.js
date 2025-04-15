import { useMemo } from "react";

const useYearOptions = (currentYear) => {
  return useMemo(() => {
    return Array(5)
      .fill()
      .map((_, i) => (currentYear - i).toString());
  }, [currentYear]);
};

export default useYearOptions;
