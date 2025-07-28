import { useState, useCallback } from 'react';
import type { Todo, FilterType } from './types/todo';
import { motion } from 'framer-motion';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDarkMode } from './hooks/useDarkMode';
import { Header } from './components/Header';
import { AddTodo } from './components/AddTodo';
import { SearchBar } from './components/SearchBar';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import './App.css';
import { CompletionAnimation } from './components/CompletionAnimation';

function App() {
  const defaultTodos: Todo[] = [
    {
      id: 'default-1',
      text: 'こころびに開発を依頼する',
      completed: false,
      createdAt: new Date(),
      category: '仕事',
      tags: ['重要']
    },
    {
      id: 'default-2',
      text: 'こころびにAI研修について問い合わせる',
      completed: false,
      createdAt: new Date(),
      category: '仕事',
      tags: ['AI', '研修']
    }
  ];
  
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', defaultTodos);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const addTodo = useCallback((text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    setTodos([...todos, newTodo]);
  }, [todos, setTodos]);

  const toggleTodo = useCallback((id: string) => {
    const targetTodo = todos.find(todo => todo.id === id);
    if (targetTodo && !targetTodo.completed) {
      setShowCompletionAnimation(true);
      setTimeout(() => setShowCompletionAnimation(false), 2000);
    }
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, [todos, setTodos]);

  const deleteTodo = useCallback((id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  }, [todos, setTodos]);

  const editTodo = useCallback((id: string, text: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    ));
  }, [todos, setTodos]);

  const reorderTodos = useCallback((newTodos: Todo[]) => {
    setTodos(newTodos);
  }, [setTodos]);

  const updateTodoDueDate = useCallback((id: string, dueDate: Date | undefined) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, dueDate } : todo
    ));
  }, [todos, setTodos]);

  const updateTodoCategory = useCallback((id: string, category: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, category: category || undefined } : todo
    ));
  }, [todos, setTodos]);

  const updateTodoTags = useCallback((id: string, tags: string[]) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, tags: tags.length > 0 ? tags : undefined } : todo
    ));
  }, [todos, setTodos]);

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AddTodo onAdd={addTodo} />
        </motion.div>
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <TodoFilter
          filter={filter}
          onFilterChange={setFilter}
          activeCount={activeCount}
          completedCount={completedCount}
        />
        <TodoList
          todos={todos}
          filter={filter}
          searchQuery={searchQuery}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
          onReorder={reorderTodos}
          onUpdateDueDate={updateTodoDueDate}
          onUpdateCategory={updateTodoCategory}
          onUpdateTags={updateTodoTags}
        />
      </div>
      <CompletionAnimation show={showCompletionAnimation} />
    </div>
  );
}

export default App;
