// components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSaved } from '@/hooks/useSaved';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/hooks/useOrganization';
import { Search, Menu, X, Bookmark, Compass, CalendarDays, Hotel, User, LogOut, Briefcase, Store, PlusCircle } from 'lucide-react';
import SignInModal from '@/components/auth/SignInModal';
import SearchModal from '@/components/search/SearchModal';
import OrganizationApplication from '@/components/organization/OrganizationApplication';
import OrganizationDashboard from '@/components/organization/OrganizationDashboard';

export default function Header() {
  const { count } = useSaved();
  const { user, isAuthenticated, signOut } = useAuth(); // ← Added signOut here
  const { getOrganizationByUser, getApplicationStatus } = useOrganization();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [organization, setOrganization] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadOrganizationData();
    }
  }, [isAuthenticated, user]);

  const loadOrganizationData = async () => {
    if (!user) return;
    const org = await getOrganizationByUser(user.id);
    const app = await getApplicationStatus(user.id);
    setOrganization(org);
    setApplication(app);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const menuItems = [
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'UpNext', href: '/upnext', icon: CalendarDays },
    { name: 'Stay', href: '/stay', icon: Hotel },
    { name: 'My REX', href: '/saved', icon: Bookmark, badge: count }
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const getOrgStatus = () => {
    if (organization) return 'active';
    if (application) return application.status;
    return 'none';
  };

  const orgStatus = getOrgStatus();

  return (
    <>
      <header className="
        fixed
        top-0
        left-0
        right-0
        z-50
        h-20
        flex
        items-center
        justify-between
        px-5
        bg-black/50
        backdrop-blur-xl
        border-b
        border-white/10
      ">
        <Link
          href="/explore"
          className="
            text-3xl
            font-black
            tracking-tight
            text-white
            flex
            items-center
            gap-1
          "
        >
          REX
          <span className="text-gold text-sm font-light tracking-wider">RWANDA</span>
        </Link>

        <div className="flex items-center gap-3">
          {/* Search Button */}
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="
              w-11
              h-11
              rounded-full
              bg-white/10
              border
              border-white/20
              backdrop-blur-xl
              flex
              items-center
              justify-center
              text-white
              hover:bg-white/20
              transition
            "
            aria-label="Search"
          >
            <Search size={21} />
          </button>

          {/* User Avatar / Sign In Button */}
          {isAuthenticated ? (
            <button
              onClick={toggleMenu}
              className="
                w-11 h-11 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-bold hover:bg-gold/30 transition
              "
            >
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </button>
          ) : (
            <button
              onClick={() => setIsSignInModalOpen(true)}
              className="
                px-4 py-2 rounded-full bg-gold text-black text-sm font-bold hover:bg-gold/80 transition
              "
            >
              Sign In
            </button>
          )}

          {/* Menu Button */}
          <button
            onClick={toggleMenu}
            className="
              w-11
              h-11
              rounded-full
              bg-white/10
              border
              border-white/20
              backdrop-blur-xl
              flex
              items-center
              justify-center
              text-white
              hover:bg-white/20
              transition
            "
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </header>

      {/* Slide-out Menu */}
      <div 
        className={`
          fixed
          top-20
          right-0
          bottom-0
          z-40
          w-80
          bg-black/95
          backdrop-blur-xl
          border-l
          border-white/10
          transform
          transition-transform
          duration-300
          ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="p-6 pt-8 overflow-y-auto h-full pb-24">
          {/* User info */}
          {isAuthenticated && user && (
            <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-xl">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email || user.phone}</p>
                </div>
              </div>
            </div>
          )}

          <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-6">Menu</p>
          
          <nav className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="
                  flex
                  items-center
                  justify-between
                  p-4
                  rounded-2xl
                  bg-white/5
                  hover:bg-white/10
                  transition
                  group
                "
              >
                <div className="flex items-center gap-4">
                  <item.icon size={20} className="text-gold" />
                  <span className="font-medium text-white group-hover:text-gold transition">
                    {item.name}
                  </span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2.5 py-0.5 bg-gold text-black text-xs font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Organization Section */}
          {isAuthenticated && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">Business</p>
              
              {orgStatus === 'active' && organization ? (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsOrgModalOpen(true);
                  }}
                  className="
                    w-full
                    flex
                    items-center
                    gap-3
                    p-4
                    rounded-2xl
                    bg-green-500/10
                    border
                    border-green-500/20
                    text-green-400
                    font-medium
                    hover:bg-green-500/20
                    transition
                  "
                >
                  <Briefcase size={18} />
                  <span>Business Dashboard</span>
                </button>
              ) : orgStatus === 'pending' ? (
                <div className="p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-yellow-400 text-sm font-medium">Application Pending</p>
                  <p className="text-yellow-400/70 text-xs mt-1">We're reviewing your application</p>
                </div>
              ) : orgStatus === 'rejected' ? (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm font-medium">Application Rejected</p>
                  <p className="text-red-400/70 text-xs mt-1">Please contact support</p>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsOrgModalOpen(true);
                  }}
                  className="
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    p-4
                    rounded-2xl
                    bg-gold/10
                    border
                    border-gold/20
                    text-gold
                    font-medium
                    hover:bg-gold/20
                    transition
                  "
                >
                  <Store size={18} />
                  List Your Business
                </button>
              )}
            </div>
          )}

          {/* Account Section */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-4">Account</p>
            
            {isAuthenticated ? (
              <button
                onClick={handleSignOut}
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  p-4
                  rounded-2xl
                  bg-red-500/10
                  border
                  border-red-500/20
                  text-red-400
                  font-medium
                  hover:bg-red-500/20
                  transition
                "
              >
                <LogOut size={18} />
                Sign Out
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsSignInModalOpen(true);
                }}
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-2
                  p-4
                  rounded-2xl
                  bg-gold/10
                  border
                  border-gold/20
                  text-gold
                  font-medium
                  hover:bg-gold/20
                  transition
                "
              >
                <User size={18} />
                Sign In / Sign Up
              </button>
            )}
          </div>

          {/* Version info */}
          <p className="absolute bottom-6 left-6 text-xs text-gray-600">
            REX v1.0 • Return on Experience
          </p>
        </div>
      </div>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sign In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSuccess={() => {
          loadOrganizationData();
        }}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      {/* Organization Modal */}
      {isOrgModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsOrgModalOpen(false)}
          />
          <div className="relative bg-black border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {orgStatus === 'active' && organization ? (
              <div className="p-6">
                <button
                  onClick={() => setIsOrgModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
                >
                  ✕
                </button>
                <h2 className="text-2xl font-bold text-white mb-2">Business Dashboard</h2>
                <p className="text-gray-400 text-sm mb-6">Manage your business on REX</p>
                <OrganizationDashboard organizationId={organization.id} />
              </div>
            ) : (
              <OrganizationApplication
                onSuccess={() => {
                  setIsOrgModalOpen(false);
                  loadOrganizationData();
                }}
                onCancel={() => setIsOrgModalOpen(false)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}