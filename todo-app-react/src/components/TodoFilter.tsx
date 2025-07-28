import React from 'react';
import type { FilterType } from '../types/todo';
import { useLanguage } from '../contexts/LanguageContext';

interface TodoFilterProps {
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  activeCount: number;
  completedCount: number;
}

export const TodoFilter: React.FC<TodoFilterProps> = ({
  filter,
  onFilterChange,
  activeCount,
  completedCount,
}) => {
  const { t } = useLanguage();
  
  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: t('todo.all') },
    { value: 'active', label: t('todo.active') },
    { value: 'completed', label: t('todo.completed') },
  ];

  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === f.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {f.label}
            {f.value === 'active' && activeCount > 0 && (
              <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">
                {activeCount}
              </span>
            )}
            {f.value === 'completed' && completedCount > 0 && (
              <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">
                {completedCount}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {activeCount} {activeCount === 1 ? t('todo.itemLeft') : t('todo.itemsLeft')}
      </div>
    </div>
  );
};