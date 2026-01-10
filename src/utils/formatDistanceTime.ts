import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export const formatDistanceTime = (
  date: Date | string | number | null | undefined
) => {
  if (date === null || date === undefined || date === "") {
    return "-:-:-";
  }

  const now = new Date(date);

  const distance = formatDistanceToNow(now, {
    addSuffix: true,
    locale: es,
  });

  return distance;
};
