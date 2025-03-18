export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-gray-300 py-6 shadow-inner">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Seertix. Tous droits réservés.
        </p>

        <nav className="flex space-x-4 mt-3 md:mt-0">
          <a
            href="#"
            className="text-sm hover:text-white transition-colors duration-300"
          >
            Conditions d'utilisation
          </a>
          <a
            href="#"
            className="text-sm hover:text-white transition-colors duration-300"
          >
            Confidentialité
          </a>
          <a
            href="#"
            className="text-sm hover:text-white transition-colors duration-300"
          >
            Aide
          </a>
        </nav>
      </div>
    </footer>
  );
}
