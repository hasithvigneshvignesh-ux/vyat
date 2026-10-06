export const PLATFORM_NAME = process.env.NEXT_PUBLIC_PLATFORM_NAME || 'Vyat';
export const PLATFORM_TAGLINE = process.env.NEXT_PUBLIC_PLATFORM_TAGLINE || 'Master Computer Science, One Skill at a Time';

// Access duration after completion (in months)
export const ACCESS_DURATION_MONTHS = 6;

// Default video signed URL expiry (in seconds)
export const VIDEO_URL_EXPIRY = 3600; // 1 hour

// Supabase storage buckets
export const STORAGE_BUCKETS = {
  LESSON_VIDEOS: 'lesson-videos',
  LESSON_RESOURCES: 'lesson-resources',
  CERTIFICATES: 'certificates',
  CERTIFICATE_TEMPLATES: 'certificate-templates',
  AVATARS: 'avatars',
} as const;

// Navigation items
export const STUDENT_NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Classes', href: '/classes', icon: 'Compass' },
  { label: 'My Skills', href: '/skills', icon: 'BookOpen' },
  { label: 'Roadmaps', href: '/roadmaps', icon: 'Map' },
  { label: 'Certificates', href: '/certificates', icon: 'Award' },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Students', href: '/admin/students', icon: 'Users' },
  { label: 'Branches', href: '/admin/branches', icon: 'GitBranch' },
  { label: 'Courses', href: '/admin/courses', icon: 'FolderOpen' },
  { label: 'Skills', href: '/admin/skills', icon: 'Zap' },
  { label: 'Lessons', href: '/admin/lessons', icon: 'PlayCircle' },
  { label: 'Questions', href: '/admin/questions', icon: 'HelpCircle' },
  { label: 'Certificates', href: '/admin/certificates', icon: 'Award' },
  { label: 'Roadmaps', href: '/admin/roadmaps', icon: 'Map' },
  { label: 'Reports', href: '/admin/reports', icon: 'BarChart3' },
  { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
] as const;

// Branch icons (used for display)
export const BRANCH_ICONS: Record<string, string> = {
  'cse-core': '💻',
  'cse-ai-ml': '🤖',
  'cse-data-science': '📊',
  'cse-cyber-security': '🔒',
};
