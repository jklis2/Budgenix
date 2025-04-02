import React from 'react';

interface SearchBarProps {
  id?: string;
  label?: string;
  placeholder: string;
  value: string;
  onChange: ((e: React.ChangeEvent<HTMLInputElement>) => void) | ((value: string) => void);
  onSearch?: (term: string) => void;
}

export function SearchBar({
  id,
  label,
  placeholder,
  value,
  onChange,
  onSearch
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof onChange === 'function') {
      if (onChange.length === 1) {
        // Jeśli funkcja przyjmuje jeden argument, zakładamy że jest to wartość
        (onChange as (value: string) => void)(e.target.value);
      } else {
        // W przeciwnym razie przekazujemy cały event
        (onChange as (e: React.ChangeEvent<HTMLInputElement>) => void)(e);
      }
    }
  };

  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <form onSubmit={handleSubmit} className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          id={id}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
      </form>
    </div>
  );
}
