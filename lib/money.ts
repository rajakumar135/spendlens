export function toPane(rupees: number): number {
  return Math.round(rupees * 100);
}

export function fromPane(paise: number): number {
  return paise / 100;
}

export function formatRupees(rupees: number): string {
  return '₹' + rupees.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
