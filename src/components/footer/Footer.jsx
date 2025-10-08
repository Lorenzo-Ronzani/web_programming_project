import { useState } from 'react';

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-12 md:flex-row">
          <div className="text-left">
            <h2 className="text-2xl font-bold">Bow Course Registration</h2>
            <p className="mt-2 text-sm text-white/90">Software Development Department</p>
          </div>

          <div className="w-full max-w-md self-stretch md:max-w-sm md:self-auto md:text-right">
            <h3 className="text-xl font-semibold">Stay Connected</h3>
            <p className="mt-1 text-sm text-white/80">Subscribe for updates and important dates.</p>
            <form className="mt-4 flex items-center justify-end gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="w-60 rounded-md border border-white/30 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/70 outline-none focus:border-white/50 focus:ring-1 focus:ring-white/50"
              />
              <button
                type="submit"
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black shadow hover:bg-gray-100"
              >
                Subscribe
              </button>
            </form>
            <div className="mt-5 h-px w-full bg-white/30" />
            <div className="mt-5 flex justify-end">
              <div className="flex items-center gap-4 rounded-full bg-white/15 p-2 backdrop-blur-sm">
                <a href="#" className="rounded-full p-2 hover:bg-white/20" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white"><path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07c0 5.01 3.66 9.17 8.44 9.95v-7.04H7.9v-2.9h2.54V9.41c0-2.5 1.49-3.88 3.77-3.88 1.09 0 2.23.2 2.23.2v2.45h-1.25c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v7.04C18.34 21.24 22 17.08 22 12.07z"/></svg>
                </a>
                <a href="#" className="rounded-full p-2 hover:bg-white/20" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white"><path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm10 2c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2.2a2.8 2.8 0 110 5.6 2.8 2.8 0 010-5.6zM17.8 6.2a1 1 0 11-2 0 1 1 0 012 0z"/></svg>
                </a>
                <a href="#" className="rounded-full p-2 hover:bg-white/20" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white"><path d="M6.94 6.5A2.44 2.44 0 114.5 4.06 2.44 2.44 0 016.94 6.5zM4.75 9h4.39v10.5H4.75zM14.1 9c-2.35 0-3.4 1.29-3.98 2.2V9H5.75v10.5h4.37v-5.8c0-1.54.29-3.03 2.2-3.03 1.88 0 1.9 1.76 1.9 3.13v5.7h4.38V13c0-3.05-1.64-4-4.5-4z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="my-8 border-t border-white/20" />

        <div className="text-center text-sm text-white/90">
          © {new Date().getFullYear()} Bow Course Registration. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
