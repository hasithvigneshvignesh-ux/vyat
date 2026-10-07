// Database type definitions for the Vyat platform
// These types mirror the Supabase PostgreSQL schema

export type UserRole = 'admin' | 'student';
export type SkillAccessStatus = 'active' | 'completed' | 'expired' | 'revoked';
export type PaymentMethod = 'upi' | 'cash';
export type PaymentStatus = 'paid' | 'pending' | 'cancelled';
export type CertificateStatus = 'generated' | 'unlocked' | 'revoked';
export type QuestionType = 'mcq' | 'multiple_choice' | 'true_false' | 'coding';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type SkillDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ResourceType = 'pdf' | 'code' | 'link' | 'file';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  university: string | null;
  student_id_number: string | null;
  branch_name: string | null;
  year: number | null;
  role: UserRole;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Course {
  id: string;
  branch_id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  branch?: Branch;
  skills?: Skill[];
}

export interface Skill {
  id: string;
  course_id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  thumbnail_url: string | null;
  price: number;
  sort_order: number;
  estimated_hours: number | null;
  difficulty: SkillDifficulty;
  is_active: boolean;
  completion_requirements: CompletionRequirements;
  created_at: string;
  updated_at: string;
  // Relations
  course?: Course;
  lessons?: Lesson[];
}

export interface CompletionRequirements {
  min_lessons_completed_pct: number;
  min_quiz_score_pct: number | null;
  quiz_required: boolean;
}

export interface Lesson {
  id: string;
  skill_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  drive_file_id: string | null;
  notes_content: string | null;
  sort_order: number;
  duration_minutes: number | null;
  is_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  skill?: Skill;
  resources?: LessonResource[];
  progress?: LessonProgress;
}

export interface LessonResource {
  id: string;
  lesson_id: string;
  title: string;
  type: ResourceType;
  file_path: string | null;
  url: string | null;
  sort_order: number;
  created_at: string;
}

export interface StudentSkillAccess {
  id: string;
  student_id: string;
  skill_id: string;
  activated_by: string | null;
  activated_at: string;
  access_start_date: string;
  completion_date: string | null;
  access_expiry_date: string | null;
  status: SkillAccessStatus;
  certificate_id: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  skill?: Skill;
  student?: Profile;
  certificate?: Certificate;
}

export interface LessonProgress {
  id: string;
  student_id: string;
  lesson_id: string;
  skill_id: string;
  is_started: boolean;
  is_completed: boolean;
  video_watched: boolean;
  watch_duration_seconds: number;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  skill_id: string;
  lesson_id: string | null;
  question_text: string;
  question_type: QuestionType;
  options: QuestionOption[] | null;
  correct_answer: string;
  explanation: string | null;
  difficulty: Difficulty;
  marks: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface QuestionOption {
  id: string;
  text: string;
}

export interface QuizAttempt {
  id: string;
  student_id: string;
  skill_id: string;
  score: number;
  total_marks: number;
  total_questions: number;
  correct_answers: number;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface QuizAnswer {
  id: string;
  attempt_id: string;
  question_id: string;
  selected_answer: string | null;
  is_correct: boolean;
  created_at: string;
}

export interface Payment {
  id: string;
  student_id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_reference: string | null;
  notes: string | null;
  recorded_by: string | null;
  received_at: string | null;
  created_at: string;
  // Relations
  student?: Profile;
}

export interface Certificate {
  id: string;
  student_id: string;
  skill_id: string;
  template_id: string | null;
  certificate_number: string;
  status: CertificateStatus;
  file_path: string | null;
  metadata: Record<string, unknown>;
  issued_at: string | null;
  created_at: string;
  // Relations
  student?: Profile;
  skill?: Skill;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  template_path: string | null;
  config: Record<string, unknown>;
  is_default: boolean;
  created_at: string;
}

export interface Roadmap {
  id: string;
  branch_id: string | null;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  // Relations
  skills?: RoadmapSkill[];
  branch?: Branch;
}

export interface RoadmapSkill {
  id: string;
  roadmap_id: string;
  skill_id: string;
  sort_order: number;
  // Relations
  skill?: Skill;
}

export interface StudentActivity {
  id: string;
  student_id: string;
  activity_type: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: string;
  description: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface PricingRule {
  id: string;
  name: string;
  description: string | null;
  skill_count: number;
  price: number;
  is_active: boolean;
  created_at: string;
}

export interface PlatformSetting {
  id: string;
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}

// Dashboard aggregate types
export interface StudentDashboardData {
  profile: Profile;
  activeSkills: (StudentSkillAccess & { skill: Skill; progress: number })[];
  completedSkills: (StudentSkillAccess & { skill: Skill })[];
  certificates: Certificate[];
  recentActivity: StudentActivity[];
  recommendedSkills: Skill[];
  overallProgress: number;
}

export interface AdminDashboardData {
  totalStudents: number;
  activeStudents: number;
  totalActiveSkills: number;
  completedSkills: number;
  certificatesIssued: number;
  expiringAccess: number;
  recentStudents: Profile[];
  recentCompletions: (StudentSkillAccess & { student: Profile; skill: Skill })[];
}
