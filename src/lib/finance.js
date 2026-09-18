const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const plain = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatINR(value) {
  return inr.format(Math.round(value));
}

export function formatNumber(value) {
  return plain.format(Math.round(value));
}

/** ₹8,00,000 → "₹8 L", ₹1,20,00,000 → "₹1.2 Cr" */
export function formatCompactINR(value) {
  if (value >= 1_00_00_000) return `₹${trim(value / 1_00_00_000)} Cr`;
  if (value >= 1_00_000) return `₹${trim(value / 1_00_000)} L`;
  if (value >= 1_000) return `₹${trim(value / 1_000)}K`;
  return `₹${value}`;
}

function trim(n) {
  return Number(n.toFixed(2)).toString();
}

export function formatTenure(months) {
  if (months % 12 === 0) return `${months / 12} yr`;
  return `${months} mo`;
}

export function calculateEmi(principal, annualRate, months) {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  const growth = Math.pow(1 + r, months);
  return (principal * r * growth) / (growth - 1);
}

export function loanSummary(principal, annualRate, months) {
  const emi = calculateEmi(principal, annualRate, months);
  const totalPayable = emi * months;
  return {
    emi,
    totalPayable,
    totalInterest: totalPayable - principal,
  };
}
