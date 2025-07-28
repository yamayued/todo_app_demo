import React, { useState, useEffect } from 'react';
import type { Todo } from '../types/todo';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onUpdateDueDate: (id: string, date: Date | undefined) => void;
  onUpdateCategory: (id: string, category: string) => void;
  onUpdateTags: (id: string, tags: string[]) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
  onUpdateDueDate,
  onUpdateCategory,
  onUpdateTags,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [showDetails, setShowDetails] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const [prevCompleted, setPrevCompleted] = useState(todo.completed);
  const { t } = useLanguage();

  useEffect(() => {
    if (todo.completed && !prevCompleted) {
      setJustCompleted(true);
      const timer = setTimeout(() => setJustCompleted(false), 1000);
      return () => clearTimeout(timer);
    }
    setPrevCompleted(todo.completed);
  }, [todo.completed, prevCompleted]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editText.trim()) {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  const getDueDateColor = () => {
    if (!todo.dueDate || todo.completed) return '';
    const date = new Date(todo.dueDate);
    if (isPast(date)) return 'text-red-500 dark:text-red-400';
    if (isToday(date)) return 'text-orange-500 dark:text-orange-400';
    if (isTomorrow(date)) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  const getDueDateLabel = () => {
    if (!todo.dueDate) return null;
    const date = new Date(todo.dueDate);
    if (isToday(date)) return t('todo.dueDate.today');
    if (isTomorrow(date)) return t('todo.dueDate.tomorrow');
    if (isPast(date) && !todo.completed) return t('todo.dueDate.overdue');
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 animate-fadeIn ${
        todo.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            className="drag-handle mt-1 cursor-move touch-none"
            {...attributes}
            {...listeners}
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </button>

          <motion.div
            animate={justCompleted ? { scale: [1, 1.3, 1], rotate: [0, 360, 360] } : {}}
            transition={{ duration: 0.6 }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500 cursor-pointer"
            />
          </motion.div>

          <div className="flex-1">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  {t('todo.save')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditText(todo.text);
                    setIsEditing(false);
                  }}
                  className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  {t('todo.cancel')}
                </button>
              </form>
            ) : (
              <div className="relative">
                <motion.p
                  animate={justCompleted ? { 
                    scale: [1, 1.05, 1]
                  } : {}}
                  transition={{ duration: 0.6 }}
                  className={`text-gray-800 dark:text-gray-200 ${
                    todo.completed ? 'line-through' : ''
                  } ${justCompleted ? 'text-green-500 dark:text-green-400' : ''}`}
                  onDoubleClick={() => setIsEditing(true)}
                >
                  {todo.text}
                </motion.p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                  {todo.dueDate && (
                    <span className={`flex items-center gap-1 ${getDueDateColor()}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {getDueDateLabel()}
                    </span>
                  )}
                  {todo.category && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                      {todo.category}
                    </span>
                  )}
                  {todo.tags && todo.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title={t('todo.details') || 'Details'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title={t('todo.edit')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              title={t('todo.delete')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="mt-4 pl-12 space-y-3 border-t dark:border-gray-700 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('todo.dueDate')}
              </label>
              <input
                type="datetime-local"
                value={todo.dueDate ? format(new Date(todo.dueDate), "yyyy-MM-dd'T'HH:mm") : ''}
                onChange={(e) => onUpdateDueDate(todo.id, e.target.value ? new Date(e.target.value) : undefined)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('todo.category')}
              </label>
              <input
                type="text"
                value={todo.category || ''}
                onChange={(e) => onUpdateCategory(todo.id, e.target.value)}
                placeholder={`e.g., ${t('todo.category.work')}, ${t('todo.category.personal')}`}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('todo.tags') || 'Tags (comma-separated)'}
              </label>
              <input
                type="text"
                value={todo.tags?.join(', ') || ''}
                onChange={(e) => onUpdateTags(todo.id, e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                placeholder="e.g., urgent, important"
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};