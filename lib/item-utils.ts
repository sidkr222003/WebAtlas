export function getPricingColor(pricing?: string): string {
  if (!pricing) return "bg-slate-600";
  if (pricing === "Free") return "bg-green-600";
  if (pricing === "Freemium") return "bg-blue-600";
  if (pricing === "Paid") return "bg-orange-600";
  return "bg-gray-600";
}
