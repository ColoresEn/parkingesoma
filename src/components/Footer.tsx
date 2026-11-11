import Link from "next/link";
import CopyrightYear from "@/components/CopyrightYear";

export default function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background/60 text-center backdrop-blur-sm">
      <div className="mx-auto w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>© <CopyrightYear /> Esoma S. L.</p>
        <nav aria-label="Legal" className="flex-wrap items-center gap-x-4 gap-y-3 justify-center sm:flex">
          <Link href="/proteccion-datos/privacy-policy" className="transition-colors hover:text-foreground ">
            Política de privacidad
          </Link>
          <Link href="/proteccion-datos/aviso-legal" className="transition-colors hover:text-foreground">
            Aviso legal
          </Link>
        </nav>
           <div className=" text-center">
          <p className="text-sm text-muted-foreground">
            Made with ❤️ by {" "}{"Quica Espi Puig "}
          </p>
     </div>
      </div>
    </footer>
  );
}
