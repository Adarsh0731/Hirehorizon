import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Briefcase, User, LogOut, LayoutDashboard, Search, Bookmark, Bell, Settings } from 'lucide-react';

export function Layout() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#F1F5F9] font-sans text-slate-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#0F172A] text-white flex flex-col h-full shrink-0 border-r border-slate-800 hidden md:flex">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-sm flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-600/20">
            H
          </div>
          <span className="text-xl font-bold tracking-tight uppercase">HireHorizon</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <Link 
            to="/search" 
            className={`flex items-center gap-3 p-3 rounded-sm transition-colors ${
              isActive('/search') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Search size={18} />
            <span className="font-medium">Find Jobs</span>
          </Link>
          
          {user && (
            <>
              <div className="px-3 py-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-4">
                {profile?.role === 'employer' ? 'Recruiter' : 'Candidate'}
              </div>
              
              {profile?.role === 'candidate' && (
                <>
                  <Link 
                    to="/applications" 
                    className={`flex items-center gap-3 p-3 rounded-sm transition-colors ${
                      isActive('/applications') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Briefcase size={18} />
                    <span>Applications</span>
                  </Link>
                  <Link 
                    to="/saved" 
                    className={`flex items-center gap-3 p-3 rounded-sm transition-colors ${
                      isActive('/saved') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <Bookmark size={18} />
                    <span>Saved</span>
                  </Link>
                </>
              )}
              
              {profile?.role === 'employer' && (
                <Link 
                  to="/dashboard" 
                  className={`flex items-center gap-3 p-3 rounded-sm transition-colors ${
                    isActive('/dashboard') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <LayoutDashboard size={18} />
                  <span>Manage Postings</span>
                </Link>
              )}

              <Link 
                to="/profile" 
                className={`flex items-center gap-3 p-3 rounded-sm transition-colors ${
                  isActive('/profile') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <User size={18} />
                <span>My Profile</span>
              </Link>
            </>
          )}
        </nav>

        {user && (
          <div className="p-6 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden border border-slate-600">
                  {user.photoURL ? <img src={user.photoURL} alt="User" /> : <User size={20} className="text-slate-400" />}
                </div>
                <div className="hidden lg:block truncate max-w-[100px]">
                  <div className="text-sm font-semibold truncate">{user.displayName || 'Alex Rivera'}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter capitalize">{profile?.role || 'Guest'}</div>
                </div>
              </div>
              <button onClick={handleLogout} className="text-slate-500 hover:text-white transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header / Global Search */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative flex items-center">
              <Search className="absolute left-4 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search for job title, company, or keywords..." 
                className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border-none rounded-sm text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            {!user ? (
               <div className="flex items-center gap-3">
                 <Link to="/login"><Button variant="ghost" className="text-sm font-bold">LOG IN</Button></Link>
                 <Link to="/register"><Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-sm tracking-wide shadow-lg shadow-blue-200">POST A JOB</Button></Link>
               </div>
            ) : (
              <>
                <div className="relative cursor-pointer text-slate-400 hover:text-slate-600">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </div>
                <Link to="/dashboard">
                  <Button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-sm tracking-wide shadow-lg shadow-blue-200 uppercase">
                    {profile?.role === 'employer' ? 'Admin Panel' : 'Apply Now'}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Content Grid */}
        <div className="flex-1 overflow-auto bg-[#F1F5F9]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
