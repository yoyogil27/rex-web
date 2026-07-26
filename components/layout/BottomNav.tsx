// components/layout/BottomNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarDays,
  Compass,
  Hotel
} from 'lucide-react';

const navigation = [
  {
    name: 'UpNext',
    label: 'Events',
    href: '/upnext',
    icon: CalendarDays
  },
  {
    name: 'Explore',
    label: 'Discover',
    href: '/explore',
    icon: Compass
  },
  {
    name: 'Stay',
    label: 'Hotels',
    href: '/stay',
    icon: Hotel
  }
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="
      fixed
      bottom-0
      left-0
      right-0
      z-50
      h-24
      bg-black/60
      backdrop-blur-xl
      border-t
      border-white/10
      flex
      items-center
      justify-around
      px-4
      pb-3
    ">
      {navigation.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex
              flex-col
              items-center
              gap-1
              px-5
              py-3
              rounded-2xl
              transition
              relative
              ${active 
                ? 'bg-gold/20 text-gold border border-gold/30 shadow-gold' 
                : 'text-white/50 hover:text-white'
              }
            `}
          >
            <Icon size={23} strokeWidth={2} />
            <span className="text-xs font-semibold">
              {item.name}
            </span>
            <span className="text-[10px] opacity-60">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}