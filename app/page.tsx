import Link from "next/link";
import { LandingForm } from "@/components/landing-form";

export default function HomePage() {
  return (
    <div className="space-y-6 py-4">
      <LandingForm />
      <div className="rounded-lg border bg-white p-4 text-sm">
        <p>
          Want instant mobile picks instead? Try <Link href="/nearby" className="text-primary underline">Nearby Now</Link>.
        </p>
      </div>
    </div>
  );
}
