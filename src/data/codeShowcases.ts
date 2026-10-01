/**
 * Code showcase examples for the Interactive Code Showcase feature.
 * These examples demonstrate technical capabilities through interactive code displays.
 */

export interface CodeShowcaseExample {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  category: 'animation' | 'cms' | 'performance' | 'ui' | 'integration';
  tags: string[];
}

export interface CodeComparisonExample {
  id: string;
  title: string;
  description: string;
  before: string;
  after: string;
  language: string;
  category: 'optimization' | 'refactor' | 'migration';
  tags: string[];
}

/**
 * Collection of code showcase examples demonstrating various technical skills
 */
export const codeShowcases: CodeShowcaseExample[] = [
  {
    id: 'framer-motion-animation',
    title: 'Scroll-Triggered Animations with Framer Motion',
    description: 'Smooth fade-in and slide-up animations triggered on scroll using Framer Motion. This pattern is used throughout the portfolio to create engaging transitions.',
    code: `import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function AnimatedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1,
      }}
    >
      {children}
    </motion.div>
  );
}

// Staggered animation for lists
export function StaggeredList({ items }: { items: string[] }) {
  return (
    <div>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
          }}
        >
          {item}
        </motion.div>
      ))}
    </div>
  );
}`,
    language: 'typescript',
    category: 'animation',
    tags: ['Framer Motion', 'React', 'Animations', 'UX'],
  },
  {
    id: 'sanity-cms-integration',
    title: 'Sanity CMS Integration with TypeScript',
    description: 'Type-safe content fetching from Sanity CMS with automatic revalidation. Demonstrates proper typing, error handling, and Next.js data fetching patterns.',
    code: `import { client } from '@/sanity/lib/client';
import { SanityDocument } from 'next-sanity';

export interface Project extends SanityDocument {
  title: string;
  slug: { current: string };
  description: string;
  image: {
    asset: {
      _ref: string;
      url: string;
    };
  };
  tech: string[];
  liveUrl?: string;
  githubUrl?: string;
}

const PROJECTS_QUERY = \`*[_type == "project" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  image {
    asset-> {
      _ref,
      url
    }
  },
  tech,
  liveUrl,
  githubUrl
}\`;

export async function getProjects(): Promise<Project[]> {
  try {
    const projects = await client.fetch<Project[]>(
      PROJECTS_QUERY,
      {},
      {
        next: {
          revalidate: 60, // Revalidate every 60 seconds
          tags: ['projects'], // Tag for on-demand revalidation
        },
      }
    );
    return projects;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

// On-demand revalidation
export async function revalidateProjects() {
  'use server';
  const { revalidateTag } = await import('next/cache');
  revalidateTag('projects');
}`,
    language: 'typescript',
    category: 'cms',
    tags: ['Sanity CMS', 'Next.js', 'TypeScript', 'Data Fetching'],
  },
  {
    id: 'lazy-loading-optimization',
    title: 'Lazy Loading with Intersection Observer',
    description: 'Performance optimization using Intersection Observer to lazy load components on scroll. Reduces initial bundle size and improves page load times.',
    code: `import { useEffect, useRef, useState, ReactNode } from 'react';

interface LazyOnScrollProps {
  children: ReactNode;
  rootMargin?: string;
  minHeight?: string;
  placeholder?: ReactNode;
  onLoad?: () => void;
}

export function LazyOnScroll({
  children,
  rootMargin = '200px',
  minHeight = '400px',
  placeholder,
  onLoad,
}: LazyOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            onLoad?.();
            observer.disconnect();
          }
        });
      },
      {
        rootMargin,
        threshold: 0.01,
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isVisible, rootMargin, onLoad]);

  return (
    <div
      ref={containerRef}
      style={{ minHeight: isVisible ? 'auto' : minHeight }}
    >
      {isVisible ? children : placeholder || <div style={{ minHeight }} />}
    </div>
  );
}

// Usage example
export function ProjectShowcase() {
  return (
    <LazyOnScroll
      minHeight="600px"
      rootMargin="300px"
      onLoad={() => console.log('Component loaded')}
    >
      <ExpensiveComponent />
    </LazyOnScroll>
  );
}`,
    language: 'typescript',
    category: 'performance',
    tags: ['Performance', 'Lazy Loading', 'Intersection Observer', 'React'],
  },
  {
    id: 'responsive-layout-pattern',
    title: 'Responsive Grid Layout with Tailwind CSS',
    description: 'Flexible grid system that adapts from single column on mobile to multi-column on larger screens, with proper spacing and alignment.',
    code: `interface ProjectGridProps {
  projects: Project[];
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function ProjectGrid({
  projects,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 }
}: ProjectGridProps) {
  const getGridCols = () => {
    const cols = [];
    if (columns.sm) cols.push(\`grid-cols-\${columns.sm}\`);
    if (columns.md) cols.push(\`md:grid-cols-\${columns.md}\`);
    if (columns.lg) cols.push(\`lg:grid-cols-\${columns.lg}\`);
    if (columns.xl) cols.push(\`xl:grid-cols-\${columns.xl}\`);
    return cols.join(' ');
  };

  return (
    <div className={\`grid \${getGridCols()} gap-6 lg:gap-8\`}>
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
          }}
          className="group relative"
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
}

// Card component with hover effects
function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-900">
        <img
          src={project.image}
          alt={project.title}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}`,
    language: 'typescript',
    category: 'ui',
    tags: ['Tailwind CSS', 'Responsive Design', 'Grid Layout', 'React'],
  },
  {
    id: 'error-boundary-pattern',
    title: 'React Error Boundary with Fallback UI',
    description: 'Robust error handling component that catches rendering errors and displays a user-friendly fallback UI with recovery options.',
    code: `import { Component, ReactNode, ErrorInfo } from 'react';
import { Icon } from '@iconify/react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
          <Icon
            icon="solar:danger-triangle-bold"
            width={64}
            height={64}
            className="text-red-500 mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
            {this.state.error.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={this.handleReset}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Icon icon="solar:refresh-outline" width={20} height={20} />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}`,
    language: 'typescript',
    category: 'ui',
    tags: ['Error Handling', 'React', 'UX', 'Resilience'],
  },
];

/**
 * Code comparison examples demonstrating before/after improvements
 */
export const codeComparisons: CodeComparisonExample[] = [
  {
    id: 'props-optimization',
    title: 'Component Props Optimization',
    description: 'Refactored component to use a single config object instead of multiple individual props, improving maintainability and reducing prop drilling.',
    before: `interface ButtonProps {
  text: string;
  onClick: () => void;
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  loading: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

export function Button({
  text,
  onClick,
  variant,
  size,
  disabled,
  loading,
  icon,
  iconPosition,
  fullWidth,
  className
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={\`btn btn-\${variant} btn-\${size} \${fullWidth ? 'w-full' : ''} \${className}\`}
    >
      {icon && iconPosition === 'left' && <Icon icon={icon} />}
      {loading ? 'Loading...' : text}
      {icon && iconPosition === 'right' && <Icon icon={icon} />}
    </button>
  );
}`,
    after: `interface ButtonConfig {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  icon?: {
    name: string;
    position?: 'left' | 'right';
  };
  fullWidth?: boolean;
}

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  config?: ButtonConfig;
  className?: string;
}

export function Button({
  children,
  onClick,
  disabled = false,
  loading = false,
  config = {},
  className = '',
}: ButtonProps) {
  const { variant = 'primary', size = 'md', icon, fullWidth = false } = config;

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={\`btn btn-\${variant} btn-\${size} \${fullWidth ? 'w-full' : ''} \${className}\`}
    >
      {icon?.position === 'left' && <Icon icon={icon.name} />}
      {loading ? 'Loading...' : children}
      {icon?.position === 'right' && <Icon icon={icon.name} />}
    </button>
  );
}`,
    language: 'typescript',
    category: 'refactor',
    tags: ['React', 'Props', 'Code Quality', 'Maintainability'],
  },
  {
    id: 'performance-memo',
    title: 'React Performance with useMemo',
    description: 'Added memoization to expensive filtering operation, preventing unnecessary recalculations on every render.',
    before: `function ProjectList({ projects, filters }: ProjectListProps) {
  const filteredProjects = projects.filter((project) => {
    if (filters.category && project.category !== filters.category) {
      return false;
    }
    if (filters.tech.length > 0) {
      return filters.tech.some((tech) => project.tech.includes(tech));
    }
    if (filters.search) {
      return project.title.toLowerCase().includes(filters.search.toLowerCase());
    }
    return true;
  });

  const sortedProjects = filteredProjects.sort((a, b) => {
    if (filters.sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  return (
    <div>
      {sortedProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}`,
    after: `import { useMemo } from 'react';

function ProjectList({ projects, filters }: ProjectListProps) {
  const sortedProjects = useMemo(() => {
    const filtered = projects.filter((project) => {
      if (filters.category && project.category !== filters.category) {
        return false;
      }
      if (filters.tech.length > 0) {
        return filters.tech.some((tech) => project.tech.includes(tech));
      }
      if (filters.search) {
        return project.title.toLowerCase().includes(filters.search.toLowerCase());
      }
      return true;
    });

    return filtered.sort((a, b) => {
      if (filters.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [projects, filters]);

  return (
    <div>
      {sortedProjects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}`,
    language: 'typescript',
    category: 'optimization',
    tags: ['React', 'Performance', 'useMemo', 'Optimization'],
  },
  {
    id: 'typescript-migration',
    title: 'JavaScript to TypeScript Migration',
    description: 'Migrated data fetching utility from JavaScript to TypeScript, adding type safety and improving developer experience.',
    before: `export async function fetchProjects() {
  try {
    const response = await fetch('/api/projects');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

export async function fetchProject(slug) {
  try {
    const response = await fetch(\`/api/projects/\${slug}\`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(\`Failed to fetch project \${slug}:\`, error);
    return null;
  }
}`,
    after: `export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  tech: string[];
  publishedAt: string;
  category: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await fetch('/api/projects');
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const result: ApiResponse<Project[]> = await response.json();
    return result.data;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

export async function fetchProject(slug: string): Promise<Project | null> {
  try {
    const response = await fetch(\`/api/projects/\${slug}\`);
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    const result: ApiResponse<Project> = await response.json();
    return result.data;
  } catch (error) {
    console.error(\`Failed to fetch project \${slug}:\`, error);
    return null;
  }
}`,
    language: 'typescript',
    category: 'migration',
    tags: ['TypeScript', 'Type Safety', 'API', 'Migration'],
  },
];

/**
 * Get showcase examples by category
 */
export function getShowcasesByCategory(category: CodeShowcaseExample['category']): CodeShowcaseExample[] {
  return codeShowcases.filter((showcase) => showcase.category === category);
}

/**
 * Get showcase example by ID
 */
export function getShowcaseById(id: string): CodeShowcaseExample | undefined {
  return codeShowcases.find((showcase) => showcase.id === id);
}

/**
 * Get comparison examples by category
 */
export function getComparisonsByCategory(category: CodeComparisonExample['category']): CodeComparisonExample[] {
  return codeComparisons.filter((comparison) => comparison.category === category);
}

/**
 * Get comparison example by ID
 */
export function getComparisonById(id: string): CodeComparisonExample | undefined {
  return codeComparisons.find((comparison) => comparison.id === id);
}
