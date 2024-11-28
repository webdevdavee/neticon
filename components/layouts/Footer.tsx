import Link from "next/link";
import { FaEnvelope, FaGavel, FaShieldAlt } from "react-icons/fa";

const Footer = () => {
  // Get current year
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/5 backdrop-blur-sm border border-zinc-800/50 rounded-t-2xl shadow-2xl overflow-hidden">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Copyright Section */}
          <div className="flex items-center space-x-3">
            <span className="text-zinc-400 text-sm font-medium">
              &copy; {currentYear} Neticon Labs. All rights reserved.
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="#"
              className="flex items-center text-zinc-400 hover:text-zinc-200 transition-colors duration-300 text-sm group"
            >
              <FaShieldAlt className="mr-2 text-zinc-500 group-hover:text-zinc-300" />
              Privacy Policy
            </Link>

            <Link
              href="#"
              className="flex items-center text-zinc-400 hover:text-zinc-200 transition-colors duration-300 text-sm group"
            >
              <FaGavel className="mr-2 text-zinc-500 group-hover:text-zinc-300" />
              Governance
            </Link>

            <Link
              href="mailto:anayookpala26@gmail.com"
              className="flex items-center text-zinc-400 hover:text-emerald-400 transition-colors duration-300 text-sm group"
            >
              <FaEnvelope className="mr-2 text-zinc-500 group-hover:text-emerald-500" />
              Speak to Developer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
