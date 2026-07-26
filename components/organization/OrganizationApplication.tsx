// components/organization/OrganizationApplication.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/hooks/useOrganization';

type Props = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function OrganizationApplication({ onSuccess, onCancel }: Props) {
  const { user } = useAuth();
  const { submitApplication, isLoading } = useOrganization();
  
  const [formData, setFormData] = useState({
    organizationName: '',
    type: 'Restaurant',
    description: '',
    phone: '',
    email: '',
    website: '',
    location: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const organizationTypes = [
    'Hotel', 'Resort', 'Restaurant', 'Cafe', 'Tour', 'Event',
    'Eco Lodge', 'Art & Culture', 'Lodge', 'Attraction', 'Activity',
    'Bar', 'Nightlife', 'Shopping', 'Spa', 'Wellness'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: Record<string, string> = {};
    if (!formData.organizationName) newErrors.organizationName = 'Business name is required';
    if (!formData.type) newErrors.type = 'Business type is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.location) newErrors.location = 'Location is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await submitApplication({
        userId: user?.id || '',
        organizationName: formData.organizationName,
        type: formData.type as any,
        description: formData.description,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        location: formData.location,
      });
      
      if (onSuccess) onSuccess();
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-2">List Your Business</h2>
      <p className="text-gray-400 text-sm mb-6">
        Get your business on REX and start reaching thousands of potential customers.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Business Name *
          </label>
          <input
            type="text"
            value={formData.organizationName}
            onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
              errors.organizationName ? 'border-red-500' : 'border-white/10'
            } text-white placeholder-gray-500 focus:border-gold focus:outline-none transition`}
            placeholder="e.g., Kigali Marriott Hotel"
          />
          {errors.organizationName && (
            <p className="text-red-400 text-xs mt-1">{errors.organizationName}</p>
          )}
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Business Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
              errors.type ? 'border-red-500' : 'border-white/10'
            } text-white focus:border-gold focus:outline-none transition appearance-none`}
          >
            {organizationTypes.map((type) => (
              <option key={type} value={type} className="bg-black">
                {type}
              </option>
            ))}
          </select>
          {errors.type && <p className="text-red-400 text-xs mt-1">{errors.type}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
              errors.description ? 'border-red-500' : 'border-white/10'
            } text-white placeholder-gray-500 focus:border-gold focus:outline-none transition resize-none`}
            placeholder="Tell users about your business..."
          />
          {errors.description && (
            <p className="text-red-400 text-xs mt-1">{errors.description}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
              errors.phone ? 'border-red-500' : 'border-white/10'
            } text-white placeholder-gray-500 focus:border-gold focus:outline-none transition`}
            placeholder="+250 788 000 000"
          />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
              errors.email ? 'border-red-500' : 'border-white/10'
            } text-white placeholder-gray-500 focus:border-gold focus:outline-none transition`}
            placeholder="you@business.com"
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Website (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Website (Optional)
          </label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-gold focus:outline-none transition"
            placeholder="https://yourbusiness.com"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Location *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${
              errors.location ? 'border-red-500' : 'border-white/10'
            } text-white placeholder-gray-500 focus:border-gold focus:outline-none transition`}
            placeholder="Kigali, Rwanda"
          />
          {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 py-3 rounded-xl bg-gold text-black font-bold hover:bg-gold/80 transition disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Your application will be reviewed by our team. You'll receive a response within 2-3 business days.
        </p>
      </form>
    </div>
  );
}