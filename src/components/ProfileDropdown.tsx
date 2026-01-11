import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileDropdownProps {
  user: any;
  onSignOut: () => void;
}

export default function ProfileDropdown({ user, onSignOut }: ProfileDropdownProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userType = user?.user_metadata?.user_type || 'customer';
  const userName = user?.user_metadata?.name || 'User';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 hover:opacity-80 transition"
          title="Go to Dashboard"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
            {getInitials(userName)}
          </div>
          <span className="text-sm font-medium text-slate-700 hidden md:block">
            {userName}
          </span>
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-slate-100 rounded transition"
          title="Menu"
        >
          <svg
            className={`w-4 h-4 text-slate-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border-2 border-slate-200 py-2 z-50 animate-fadeIn">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-slate-200">
            <p className="font-bold text-slate-900">{userName}</p>
            <p className="text-sm text-slate-600">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-sky-100 text-sky-700 text-xs font-semibold rounded-full">
              {userType === 'pro' ? 'Pro Maker' : 'Customer'}
            </span>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                navigate('/profile');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-sky-50 transition flex items-center gap-3"
            >
              <span className="text-lg">👤</span>
              <span>Profile</span>
            </button>

            {userType === 'customer' ? (
              <>
                <button
                  onClick={() => {
                    navigate('/post-job');
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-sky-50 transition flex items-center gap-3"
                >
                  <span className="text-lg">📝</span>
                  <span>Post a Job</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/my-jobs');
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-sky-50 transition flex items-center gap-3"
                >
                  <span className="text-lg">💼</span>
                  <span>My Jobs</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate('/browse-jobs');
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-sky-50 transition flex items-center gap-3"
                >
                  <span className="text-lg">🔍</span>
                  <span>Browse Jobs</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/my-proposals');
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-sky-50 transition flex items-center gap-3"
                >
                  <span className="text-lg">📝</span>
                  <span>My Proposals</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/my-projects');
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-sky-50 transition flex items-center gap-3"
                >
                  <span className="text-lg">💼</span>
                  <span>My Projects</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/my-services');
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-sky-50 transition flex items-center gap-3"
                >
                  <span className="text-lg">⚙️</span>
                  <span>My Services</span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                navigate('/settings');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-slate-700 hover:bg-sky-50 transition flex items-center gap-3"
            >
              <span className="text-lg">⚙️</span>
              <span>Settings</span>
            </button>
          </div>

          {/* Sign Out */}
          <div className="border-t border-slate-200 pt-2">
            <button
              onClick={() => {
                onSignOut();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition flex items-center gap-3 font-medium"
            >
              <span className="text-lg">🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}