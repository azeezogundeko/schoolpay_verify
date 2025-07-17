import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const AdminBreadcrumbs = ({ customBreadcrumbs = null }) => {
  const location = useLocation();

  const getBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathMap = {
      '/admin-dashboard': [
        { label: 'Dashboard', path: '/admin-dashboard', icon: 'LayoutDashboard' }
      ],
      '/receipt-review-detail': [
        { label: 'Dashboard', path: '/admin-dashboard', icon: 'LayoutDashboard' },
        { label: 'Receipt Review', path: '/receipt-review-detail', icon: 'FileText' }
      ]
    };

    return pathMap[location.pathname] || [
      { label: 'Dashboard', path: '/admin-dashboard', icon: 'LayoutDashboard' }
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="bg-background border-b border-border py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center">
              {index > 0 && (
                <Icon 
                  name="ChevronRight" 
                  size={16} 
                  className="text-muted-foreground mx-2" 
                />
              )}
              
              {index === breadcrumbs.length - 1 ? (
                // Current page - not clickable
                <div className="flex items-center space-x-1 text-foreground font-medium">
                  <Icon name={crumb.icon} size={16} />
                  <span>{crumb.label}</span>
                </div>
              ) : (
                // Previous pages - clickable
                <Link
                  to={crumb.path}
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-hover"
                >
                  <Icon name={crumb.icon} size={16} />
                  <span>{crumb.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AdminBreadcrumbs;