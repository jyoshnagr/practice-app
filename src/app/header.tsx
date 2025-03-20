// app/header.tsx

import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex justify-center space-x-6">
        <Link href="/home" className="hover:text-gray-400">Home</Link>
        <Link href="/about" className="hover:text-gray-400">About</Link>
        <Link href="/dashboard" className="hover:text-gray-400">Dashboard</Link>
      </nav>
    </header>
  );
};

export default Header;
