import { BUS_LINES } from "@/constants/lines";
import { LinePageClient } from "./LinePageClient";

export function generateStaticParams() {
  return BUS_LINES.map((line) => ({
    id: line.id,
  }));
}

export default function LinePage() {
  return <LinePageClient />;
}
