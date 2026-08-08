import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/site";

export function WhatsAppButton() {
  return (
    <Link
      href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
        "Hi Sbabu AI, I'd like to talk about a project."
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_-8px_rgba(37,211,102,0.6)] transition-transform hover:scale-105 active:scale-95 md:bottom-8 md:right-8"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30 group-hover:opacity-50" />
      <MessageCircle className="relative size-7" fill="white" strokeWidth={0} />
    </Link>
  );
}
