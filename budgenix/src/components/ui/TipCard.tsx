import React from 'react';

interface TipAction {
  label: string;
  onClick?: () => void;
}

interface TipCardProps {
  title: string;
  content: string;
  icon?: React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  titleColor?: string;
  contentColor?: string;
  actions?: TipAction[];
}

export function TipCard({
  title,
  content,
  icon,
  bgColor = "bg-indigo-50",
  borderColor = "border-indigo-100",
  titleColor = "text-indigo-900",
  contentColor = "text-indigo-800",
  actions = []
}: TipCardProps) {
  return (
    <div className={`${bgColor} rounded-xl p-6 border ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-start">
          {icon && (
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-4 mt-1">
              {icon}
            </div>
          )}
          <div>
            <h3 className={`text-lg font-semibold ${titleColor} mb-1`}>{title}</h3>
            <p className={contentColor}>
              {content}
            </p>
          </div>
        </div>
        {actions.length > 0 && (
          <div className="flex gap-2 mt-4 md:mt-0">
            {actions.map((action, index) => (
              <button
                key={index}
                type="button"
                onClick={action.onClick}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
