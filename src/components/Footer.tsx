import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-sky-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">●</span>
              </div>
              <span className="font-bold text-white text-xl">Nearly</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Connecting clients with independent local workers for commissions and services.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-bold text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/browse" className="text-slate-400 hover:text-white transition">
                  Browse Workers
                </Link>
              </li>
              <li>
                <Link to="/browse-jobs" className="text-slate-400 hover:text-white transition">
                  Browse Commissions
                </Link>
              </li>
              <li>
                <Link to="/post-job" className="text-slate-400 hover:text-white transition">
                  Post a Commission
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-400 hover:text-white transition">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-slate-400 hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-400 hover:text-white transition">
                  Help Center
                </Link>
              </li>
              <li>
                <a href="mailto:support@nearly.com" className="text-slate-400 hover:text-white transition">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-bold text-white mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@nearly.com" className="text-slate-400 hover:text-white transition">
                  support@nearly.com
                </a>
              </li>
              <li>
                <a href="mailto:hello@nearly.com" className="text-slate-400 hover:text-white transition">
                  hello@nearly.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {currentYear} Nearly. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6 text-sm">
              <Link to="/privacy" className="text-slate-400 hover:text-white transition">
                Privacy
              </Link>
              <span className="text-slate-600">•</span>
              <Link to="/faq" className="text-slate-400 hover:text-white transition">
                Help
              </Link>
              <span className="text-slate-600">•</span>
              <a href="mailto:support@nearly.com" className="text-slate-400 hover:text-white transition">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}