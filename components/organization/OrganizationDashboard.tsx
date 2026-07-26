// components/organization/OrganizationDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useOrganization } from '@/hooks/useOrganization';
import { useAuth } from '@/hooks/useAuth';
import { Eye, Heart, Share2, MapPin, Plus, Edit } from 'lucide-react';

type Props = {
  organizationId: string;
};

export default function OrganizationDashboard({ organizationId }: Props) {
  const { getDashboard, isLoading } = useOrganization();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const data = await getDashboard(organizationId);
      setDashboard(data);
    };
    loadDashboard();
  }, [organizationId, getDashboard]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-3 border-gold border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-400 ml-3">Loading dashboard...</span>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No dashboard data available</p>
      </div>
    );
  }

  const { stats } = dashboard;

  const statItems = [
    { icon: Eye, label: 'Views', value: stats.totalViews, color: 'text-blue-400' },
    { icon: Heart, label: 'Saves', value: stats.totalSaves, color: 'text-red-400' },
    { icon: Share2, label: 'Shares', value: stats.totalShares, color: 'text-green-400' },
    { icon: MapPin, label: 'Places', value: stats.totalPlaces, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {statItems.map((item) => (
          <div
            key={item.label}
            className="p-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-2">
              <item.icon size={18} className={item.color} />
              <span className="text-gray-400 text-sm">{item.label}</span>
            </div>
            <p className="text-2xl font-bold text-white mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button className="p-4 rounded-2xl bg-gold/10 border border-gold/20 text-gold font-medium hover:bg-gold/20 transition flex items-center justify-center gap-2">
          <Plus size={18} />
          Add Experience
        </button>
        <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition flex items-center justify-center gap-2">
          <Edit size={18} />
          Edit Profile
        </button>
      </div>

      {/* Recent Activity */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
        <h4 className="text-sm font-semibold text-gray-400 mb-3">Recent Activity</h4>
        <div className="space-y-2">
          {stats.recentActivity.map((activity: any) => (
            <div key={activity.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-white text-sm capitalize">{activity.type}</span>
              <span className="text-gold text-sm font-semibold">{activity.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}