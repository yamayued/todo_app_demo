import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'ja' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface TranslationKeys {
  [key: string]: {
    ja: string;
    en: string;
  };
}

const translations: TranslationKeys = {
  'app.title': {
    ja: 'Cocorobi ToDo App',
    en: 'Cocorobi ToDo App'
  },
  'app.darkMode': {
    ja: 'ダークモード',
    en: 'Dark Mode'
  },
  'todo.add': {
    ja: 'タスクを追加',
    en: 'Add Task'
  },
  'todo.addPlaceholder': {
    ja: '新しいタスクを入力...',
    en: 'Enter a new task...'
  },
  'todo.searchPlaceholder': {
    ja: 'タスクを検索...',
    en: 'Search tasks...'
  },
  'todo.all': {
    ja: 'すべて',
    en: 'All'
  },
  'todo.active': {
    ja: '未完了',
    en: 'Active'
  },
  'todo.completed': {
    ja: '完了済み',
    en: 'Completed'
  },
  'todo.delete': {
    ja: '削除',
    en: 'Delete'
  },
  'todo.edit': {
    ja: '編集',
    en: 'Edit'
  },
  'todo.save': {
    ja: '保存',
    en: 'Save'
  },
  'todo.cancel': {
    ja: 'キャンセル',
    en: 'Cancel'
  },
  'todo.priority': {
    ja: '優先度',
    en: 'Priority'
  },
  'todo.priority.low': {
    ja: '低',
    en: 'Low'
  },
  'todo.priority.medium': {
    ja: '中',
    en: 'Medium'
  },
  'todo.priority.high': {
    ja: '高',
    en: 'High'
  },
  'todo.dueDate': {
    ja: '期限',
    en: 'Due Date'
  },
  'todo.category': {
    ja: 'カテゴリー',
    en: 'Category'
  },
  'todo.category.work': {
    ja: '仕事',
    en: 'Work'
  },
  'todo.category.personal': {
    ja: 'プライベート',
    en: 'Personal'
  },
  'todo.category.shopping': {
    ja: '買い物',
    en: 'Shopping'
  },
  'todo.category.health': {
    ja: '健康',
    en: 'Health'
  },
  'todo.category.other': {
    ja: 'その他',
    en: 'Other'
  },
  'todo.tags': {
    ja: 'タグ (カンマ区切り)',
    en: 'Tags (comma-separated)'
  },
  'todo.details': {
    ja: '詳細',
    en: 'Details'
  },
  'todo.dueDate.today': {
    ja: '今日',
    en: 'Today'
  },
  'todo.dueDate.tomorrow': {
    ja: '明日',
    en: 'Tomorrow'
  },
  'todo.dueDate.overdue': {
    ja: '期限切れ',
    en: 'Overdue'
  },
  'todo.noTasks': {
    ja: 'タスクがありません',
    en: 'No tasks found'
  },
  'todo.noTasksSearch': {
    ja: '検索条件に一致するタスクが見つかりませんでした。',
    en: 'No todos found matching your search.'
  },
  'todo.noTasksYet': {
    ja: 'まだタスクがありません。追加して始めましょう！',
    en: 'No todos yet. Add one to get started!'
  },
  'todo.completionMessage': {
    ja: 'よくできました！',
    en: 'Well done!'
  },
  'todo.itemsLeft': {
    ja: '件の未完了',
    en: 'items left'
  },
  'todo.itemLeft': {
    ja: '件の未完了',
    en: 'item left'
  },
  'error.loadingTodos': {
    ja: 'タスクの読み込みに失敗しました',
    en: 'Failed to load todos'
  },
  'error.savingTodo': {
    ja: 'タスクの保存に失敗しました',
    en: 'Failed to save todo'
  },
  'error.deletingTodo': {
    ja: 'タスクの削除に失敗しました',
    en: 'Failed to delete todo'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ja';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};