import React from 'react';

interface EmptyStateCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionButton?: React.ReactNode;
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  icon,
  title,
  description,
  actionButton
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      {actionButton}
    </div>
  );
};

export default EmptyStateCard;
