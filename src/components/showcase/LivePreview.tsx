"use client";

import { ReactNode, useState, Component, ErrorInfo } from 'react';
import { Icon } from '@iconify/react';

interface LivePreviewProps {
  /** The React component to render in the preview */
  children: ReactNode;
  /** Title for the preview pane */
  title?: string;
  /** Custom height for the preview (default: auto) */
  height?: string;
  /** Background color for the preview area */
  background?: 'white' | 'gray' | 'transparent';
  /** Whether to show theme toggle control */
  showThemeToggle?: boolean;
  /** Whether to show refresh/reset button */
  showRefresh?: boolean;
  /** Initial theme mode */
  defaultTheme?: 'light' | 'dark';
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

// Error boundary component to catch rendering errors safely
class PreviewErrorBoundary extends Component<
  { children: ReactNode; onReset: () => void },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; onReset: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Preview component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Icon
            icon="solar:danger-triangle-bold"
            width={48}
            height={48}
            className="text-red-500 mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Component Error
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md">
            {this.state.error?.message || 'An error occurred while rendering the component'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: undefined });
              this.props.onReset();
            }}
            className="px-4 py-2 text-sm rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="solar:refresh-outline" width={16} height={16} />
            Reset Preview
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function LivePreview({
  children,
  title,
  height = 'auto',
  background = 'white',
  showThemeToggle = true,
  showRefresh = true,
  defaultTheme = 'light',
}: LivePreviewProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(defaultTheme);
  const [key, setKey] = useState(0);

  // Handle refresh/reset
  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Get background classes based on theme and background prop
  const getBackgroundClasses = () => {
    if (background === 'transparent') {
      return 'bg-transparent';
    }
    if (background === 'gray') {
      return theme === 'light' ? 'bg-gray-50' : 'bg-gray-900';
    }
    return theme === 'light' ? 'bg-white' : 'bg-gray-950';
  };

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-lg">
      {/* Header Controls */}
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            icon="solar:monitor-outline"
            width={16}
            height={16}
            className="text-gray-600 dark:text-gray-400"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title || 'Live Preview'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {showThemeToggle && (
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <Icon
                icon={theme === 'light' ? 'solar:moon-outline' : 'solar:sun-outline'}
                width={18}
                height={18}
              />
            </button>
          )}
          {showRefresh && (
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all"
              title="Reset preview"
            >
              <Icon icon="solar:refresh-outline" width={18} height={18} />
            </button>
          )}
        </div>
      </div>

      {/* Preview Content Area */}
      <div
        className={`${getBackgroundClasses()} p-6 flex items-center justify-center transition-colors`}
        style={{
          height: height !== 'auto' ? height : undefined,
          minHeight: height === 'auto' ? '300px' : undefined,
        }}
        data-theme={theme}
      >
        <div className={`w-full ${theme === 'dark' ? 'dark' : ''}`}>
          <PreviewErrorBoundary key={key} onReset={handleRefresh}>
            <div className="w-full max-w-2xl mx-auto">
              {children}
            </div>
          </PreviewErrorBoundary>
        </div>
      </div>
    </div>
  );
}
