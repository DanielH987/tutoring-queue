import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-black p-4 fixed bottom-0 w-full h-16 flex justify-center items-center">
      <p className="mr-4">&copy; 2024 Daniel Hootini</p>
      <nav>
        <ul className="flex space-x-4 m-0 p-0 list-none">
          <li>
            <Link href="/about" className="hover:underline">About</Link>
          </li>
          <li>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
