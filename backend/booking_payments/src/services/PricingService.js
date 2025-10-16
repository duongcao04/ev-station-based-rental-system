
export const calcCost = ({ start_time, end_time, price_per_hour }) => {
  const start = new Date(start_time).getTime();
  const end = new Date(end_time).getTime();
  if (isNaN(start) || isNaN(end) || end <= start) return 0;

  const minutes = Math.ceil((end - start) / 60000);
  const hours = minutes / 60;
  const cost = Number(price_per_hour) * hours;
  return Math.round(cost * 100) / 100;
};
