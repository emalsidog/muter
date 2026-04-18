export const formatIsoDate = (isoString: string) => {
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) return 'Invalid Date';

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
