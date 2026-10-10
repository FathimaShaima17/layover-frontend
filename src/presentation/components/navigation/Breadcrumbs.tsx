import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const Breadcrumbs: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.45rem',
        fontSize: '0.8125rem',
        color: 'var(--color-text-muted)',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
      }}
    >
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          color: 'var(--color-text-muted)',
          transition: 'color var(--transition-fast)',
        }}
      >
        <Home size={14} />
        <span>Home</span>
      </Link>

      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight size={13} style={{ flexShrink: 0 }} />
          {item.path ? (
            <Link
              to={item.path}
              style={{
                color: 'var(--color-text-secondary)',
                transition: 'color var(--transition-fast)',
              }}
            >
              {item.label}
            </Link>
          ) : (
            <span
              style={{
                color: 'var(--color-primary)',
                fontWeight: 600,
                maxWidth: '220px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
