import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6 mt-2.5">
      <Link 
        to="/" 
        className="flex items-center text-gray-500 hover:text-brand-primary transition-colors"
      >
        <Home size={16} />
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <ChevronRight size={16} className="text-gray-400" />
          {item.path && index !== items.length - 1 ? (
            <Link 
              to={item.path} 
              className="text-gray-500 hover:text-brand-primary transition-colors capitalize"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium capitalize">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};
