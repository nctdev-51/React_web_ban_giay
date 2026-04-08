import { TopBar } from "./TopBar";
import { MainNav } from "./MainBar";

export type HeaderProps = {
  className?: string;
};

export function Header({ className = "" }: HeaderProps) {
  return (
    <header className={`sticky top-0 z-50 bg-white ${className}`}>
      <TopBar />
      <MainNav />
    </header>
  );
}

export default Header;
