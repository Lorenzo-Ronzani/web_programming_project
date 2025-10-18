function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 text-white mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-4 text-center">
        <h2 className="text-xl font-bold">Bow Course Registration</h2>
        <p className="mt-1 text-sm text-white/90">Software Development Department</p>

        <div className="my-3 border-t border-white/20" />

        <div className="text-center text-xs text-white/90 pb-2">
          © {new Date().getFullYear()} Bow Course Registration. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
