export function formatCLP(amount: number): string {
  if (isNaN(amount)) return '$0';
  return '$' + Math.round(amount).toLocaleString('es-CL');
}

export function formatKm(km: number): string {
  if (isNaN(km)) return '0 km';
  return Math.round(km).toLocaleString('es-CL') + ' km';
}

export function calculateMonthlyFee(price: number, downPercent: number = 20, installments: number = 36): number {
  const downPayment = (price * downPercent) / 100;
  const loanAmount = price - downPayment;
  const monthlyRate = 0.0135; // 1.35% monthly interest rate
  
  if (installments <= 0) return 0;
  const factor = Math.pow(1 + monthlyRate, installments);
  const monthlyFee = (loanAmount * (monthlyRate * factor)) / (factor - 1);
  return Math.round(monthlyFee);
}

export function buildWhatsAppLink(phone: string = '5698253776', message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
