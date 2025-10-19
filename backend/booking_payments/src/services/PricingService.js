
export const calcCost = ({
  start_time,
  end_time,
  pricing_type,
  price_per_day,
  price_per_month,
  price_per_year
}) => {
  const start = new Date(start_time).getTime();
  const end = new Date(end_time).getTime();
  if (isNaN(start) || isNaN(end) || end <= start) return 0;

  const durationMs = end - start;
  const durationDays = durationMs / (1000 * 60 * 60 * 24);
  const durationMonths = durationDays / 30.44; 
  const durationYears = durationDays / 365.25; 

  let cost = 0;

  switch (pricing_type) {
    case 'daily':
      cost = Number(price_per_day) * Math.ceil(durationDays);
      break;
    case 'monthly':
      cost = Number(price_per_month) * Math.ceil(durationMonths);
      break;
    case 'yearly':
      cost = Number(price_per_year) * Math.ceil(durationYears);
      break;
    default:
      // fallback
      cost = Number(price_per_day) * Math.ceil(durationDays);
  }

  return Math.round(cost * 100) / 100;
};
