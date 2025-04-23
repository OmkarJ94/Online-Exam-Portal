import { parseISO, differenceInSeconds, intervalToDuration } from "date-fns";

export const getFormattedTimeTaken = (
  startTime: string,
  endTime: string
): string => {
  const start = parseISO(startTime);
  const end = parseISO(endTime);

  const totalSeconds = differenceInSeconds(end, start);
  const duration = intervalToDuration({ start, end });

  const pad = (num: number) => String(num).padStart(2, "0");

  const hours = pad(duration.hours ?? 0);
  const minutes = pad(duration.minutes ?? 0);
  const seconds = pad(duration.seconds ?? 0);

  return `${hours}:${minutes}:${seconds}`;
};
