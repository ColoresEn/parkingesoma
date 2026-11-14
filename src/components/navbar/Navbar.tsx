import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import getCurrentUser from "@/actions/getCurrentUser";
import UserButton from "./UserButton";

const Navbar = async () => {
  await connection();
  const currentUser = await getCurrentUser();

  return (
    <header className="site-header">
      <div className="site-nav">
        <Link className="brand-lockup" href="/" aria-label="Murals and Criptos home">
          <Image
            src="/img/pnglogoxs.fw.png"
            alt=""
            width={44}
            height={44}
            priority
          />
          <span className="brand-name">Murals &amp; Criptos</span>
        </Link>
        <nav className="primary-nav" aria-label="Main navigation">
          <Link href="/murals">Murals</Link>
          <Link href="/criptos">Crypto</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="nav-actions">
          {currentUser ? (
            <UserButton user={currentUser} />
          ) : (
            <>
              <Link className="nav-sign-in" href="/login">Sign in</Link>
              <Link className="nav-join" href="/register">Join</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
