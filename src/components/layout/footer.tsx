import Link from "next/link";
import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                RoamIO
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-light max-w-sm leading-relaxed">
              Effortless Exploration. Discover tailored itineraries designed by AI
              to match your unique travel style.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/plan" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 transition-colors font-light">
                  Plan a Trip
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 transition-colors font-light">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 transition-colors font-light">
                  How it works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 transition-colors font-light">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 transition-colors font-light">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-slate-50 transition-colors font-light">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/60">
          <p className="text-xs text-slate-400 font-light">
            © {new Date().getFullYear()} RoamIO. Effortless Exploration.
          </p>
        </div>
      </div>
    </footer>
  );
}
