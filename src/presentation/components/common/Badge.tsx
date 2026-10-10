import React from 'react';
import { PlaceType, PlaceStatus, PlaceCategory } from '../../../domain/entities/Place';
import { Sparkles, Star, Clock, CheckCircle } from 'lucide-react';

interface BadgeProps {
  type?: PlaceType;
  status?: PlaceStatus;
  category?: PlaceCategory;
  className?: string;
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ type, status, category, className = '', children }) => {
  if (type === 'hidden-gem') {
    return (
      <span className={`badge badge-gem ${className}`}>
        <Sparkles size={12} strokeWidth={2.5} />
        <span>Hidden Gem</span>
      </span>
    );
  }

  if (type === 'famous-attraction') {
    return (
      <span className={`badge badge-famous ${className}`}>
        <Star size={12} strokeWidth={2.5} />
        <span>Famous Landmark</span>
      </span>
    );
  }

  if (status === 'pending') {
    return (
      <span className={`badge badge-pending ${className}`}>
        <Clock size={12} strokeWidth={2.5} />
        <span>Pending Review</span>
      </span>
    );
  }

  if (status === 'approved') {
    return (
      <span className={`badge badge-gem ${className}`}>
        <CheckCircle size={12} strokeWidth={2.5} />
        <span>Community Verified</span>
      </span>
    );
  }

  return (
    <span className={`badge badge-neutral ${className}`}>
      {children || category}
    </span>
  );
};
