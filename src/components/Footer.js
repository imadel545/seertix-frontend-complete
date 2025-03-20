export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-8 shadow-inner">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        <p className="text-sm">&copy; {new Date().getFullYear()} Seertix. Tous droits réservés.</p>
        <nav className="flex space-x-4 mt-3 md:mt-0">
          <a href="#" className="hover:text-white">Conditions</a>
          <a href="#" className="hover:text-white">Confidentialité</a>
          <a href="#" className="hover:text-white">Aide</a>
        </nav>
      </div>
    </footer>
  );
}
