import Link from "next/link";
import { Logo } from "@/components/icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center space-x-2 text-primary">
          <Logo className="h-6 w-6" />
          <span className="font-bold font-headline">Event Horizon</span>
        </Link>
      </div>
      {children}
    </div>
  );
}
