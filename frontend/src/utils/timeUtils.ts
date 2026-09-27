import { formatDistanceStrict, format } from "date-fns";

export const formatDateDistance = (endDate: string | number | Date): string => {
  const distance = formatDistanceStrict(new Date(), new Date(endDate));
  const duration = distance.split(" ");
  duration[1] = duration[1].substring(0, 1);
  if (duration[1] === "s") {
    return "Just now";
  }
  return duration.join(" ");
};

export const formatDate = (date: string | number | Date): string => {
  const formattedDate = format(new Date(date), "MMMM d");
  return formattedDate;
};
