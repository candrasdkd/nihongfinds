import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}

export const Card = ({ children, className = '', title, description }: CardProps) => {
  return (
    <div className={`overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm ${className}`}>
      {(title || description) && (
        <div className="flex flex-col space-y-1.5 p-6 border-b">
          {title && <h3 className="text-xl font-semibold leading-none tracking-tight">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <div className={title || description ? 'p-6 pt-0' : 'p-6'}>
        {children}
      </div>
    </div>
  );
};
