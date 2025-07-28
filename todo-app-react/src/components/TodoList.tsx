import React from 'react';
import type { Todo, FilterType } from '../types/todo';
import { TodoItem } from './TodoItem';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface TodoListProps {
  todos: Todo[];
  filter: FilterType;
  searchQuery: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onReorder: (todos: Todo[]) => void;
  onUpdateDueDate: (id: string, date: Date | undefined) => void;
  onUpdateCategory: (id: string, category: string) => void;
  onUpdateTags: (id: string, tags: string[]) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  searchQuery,
  onToggle,
  onDelete,
  onEdit,
  onReorder,
  onUpdateDueDate,
  onUpdateCategory,
  onUpdateTags,
}) => {
  const { t } = useLanguage();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTodos = todos.filter((todo) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && !todo.completed) ||
      (filter === 'completed' && todo.completed);

    const matchesSearch =
      !searchQuery ||
      todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newTodos = arrayMove(todos, oldIndex, newIndex);
        onReorder(newTodos);
      }
    }
  };

  if (filteredTodos.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          {searchQuery ? t('todo.noTasksSearch') : t('todo.noTasksYet')}
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={filteredTodos.map(todo => todo.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          <AnimatePresence>
            {filteredTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                layout
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  delay: index * 0.05
                }}
              >
                <TodoItem
                  todo={todo}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  onUpdateDueDate={onUpdateDueDate}
                  onUpdateCategory={onUpdateCategory}
                  onUpdateTags={onUpdateTags}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
};