export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

export const compactNumberFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 2,
  minimumFractionDigits: 1,
  style: "decimal",
});

export const percentageFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

export const AVAILABLE_SYMBOLS = ["AAPL", "QQQ", "TRP", "INFY"];

export const VITE_REACT_APP_API_URL =
  import.meta.env.VITE_REACT_APP_API_URL || "";

if (!VITE_REACT_APP_API_URL) {
  throw new Error("VITE_REACT_APP_API_URL is not defined");
}
