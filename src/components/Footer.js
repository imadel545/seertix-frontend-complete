export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-zinc-900 border-t dark:border-zinc-700 py-6 mt-12 text-sm text-gray-600 dark:text-gray-400">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="text-center md:text-left">
          &copy; {new Date().getFullYear()}{" "}
          <strong className="text-indigo-600 dark:text-indigo-400">
            Seertix
          </strong>
          . Tous droits réservés.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-indigo-500 transition">
            Conditions
          </a>
          <a href="#" className="hover:text-indigo-500 transition">
            Confidentialité
          </a>
          <a href="#" className="hover:text-indigo-500 transition">
            Aide
          </a>
        </div>
      </div>
    </footer>
  );
}
