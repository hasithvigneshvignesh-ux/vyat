-- ============================================================
-- CodeFundas - ALL-IN-ONE SUPABASE DATABASE SETUP
-- ============================================================
-- Run this ONCE in the Supabase SQL Editor to set up:
-- 1. All Tables & Foreign Keys
-- 2. Performance Indexes
-- 3. Auto-update & Profile Triggers
-- 4. Row Level Security (RLS) Policies
-- 5. Complete Curriculum Seed Data (Branches, Courses, Skills, Lessons)
-- ============================================================

-- ============================================================
-- 1. HELPER FUNCTIONS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 2. TABLES DEFINITIONS
-- ============================================================

-- TABLE: profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  university TEXT,
  student_id_number TEXT,
  branch_name TEXT,
  year INTEGER,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student')),
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active);

DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- TABLE: branches
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_branches_slug ON branches(slug);
CREATE INDEX IF NOT EXISTS idx_branches_sort ON branches(sort_order);

-- TABLE: courses
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(branch_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_courses_branch ON courses(branch_id);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);

DROP TRIGGER IF EXISTS set_courses_updated_at ON courses;
CREATE TRIGGER set_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- TABLE: skills
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  thumbnail_url TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 500.00,
  sort_order INTEGER NOT NULL DEFAULT 0,
  estimated_hours INTEGER,
  difficulty TEXT DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  completion_requirements JSONB DEFAULT '{"min_lessons_completed_pct": 100, "min_quiz_score_pct": null, "quiz_required": false}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(course_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_skills_course ON skills(course_id);
CREATE INDEX IF NOT EXISTS idx_skills_slug ON skills(slug);

DROP TRIGGER IF EXISTS set_skills_updated_at ON skills;
CREATE TRIGGER set_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- TABLE: lessons
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_path TEXT,
  notes_content TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER,
  is_required BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lessons_skill ON lessons(skill_id);
CREATE INDEX IF NOT EXISTS idx_lessons_sort ON lessons(skill_id, sort_order);

DROP TRIGGER IF EXISTS set_lessons_updated_at ON lessons;
CREATE TRIGGER set_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- TABLE: lesson_resources
CREATE TABLE IF NOT EXISTS lesson_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'code', 'link', 'file')),
  file_path TEXT,
  url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lesson_resources_lesson ON lesson_resources(lesson_id);

-- TABLE: student_skill_access
CREATE TABLE IF NOT EXISTS student_skill_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  activated_by UUID REFERENCES profiles(id),
  activated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  access_start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  completion_date TIMESTAMPTZ,
  access_expiry_date TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired', 'revoked')),
  certificate_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_ssa_student ON student_skill_access(student_id);
CREATE INDEX IF NOT EXISTS idx_ssa_skill ON student_skill_access(skill_id);
CREATE INDEX IF NOT EXISTS idx_ssa_status ON student_skill_access(status);

DROP TRIGGER IF EXISTS set_ssa_updated_at ON student_skill_access;
CREATE TRIGGER set_ssa_updated_at
  BEFORE UPDATE ON student_skill_access
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- TABLE: lesson_progress
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  is_started BOOLEAN NOT NULL DEFAULT false,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  video_watched BOOLEAN NOT NULL DEFAULT false,
  watch_duration_seconds INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lp_student ON lesson_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_lp_lesson ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lp_skill ON lesson_progress(student_id, skill_id);

DROP TRIGGER IF EXISTS set_lp_updated_at ON lesson_progress;
CREATE TRIGGER set_lp_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- TABLE: questions
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'mcq' CHECK (question_type IN ('mcq', 'multiple_choice', 'true_false', 'coding')),
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  marks INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questions_skill ON questions(skill_id);
CREATE INDEX IF NOT EXISTS idx_questions_lesson ON questions(lesson_id);

-- TABLE: quiz_attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  total_marks INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qa_student ON quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_qa_skill ON quiz_attempts(skill_id);

-- TABLE: quiz_answers
CREATE TABLE IF NOT EXISTS quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  selected_answer TEXT,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qans_attempt ON quiz_answers(attempt_id);

-- TABLE: payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('upi', 'cash')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending', 'cancelled')),
  payment_reference TEXT,
  notes TEXT,
  recorded_by UUID REFERENCES profiles(id),
  received_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_student ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);

-- TABLE: certificate_templates
CREATE TABLE IF NOT EXISTS certificate_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  template_path TEXT,
  config JSONB DEFAULT '{}'::jsonb,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TABLE: certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  template_id UUID REFERENCES certificate_templates(id),
  certificate_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'generated' CHECK (status IN ('generated', 'unlocked', 'revoked')),
  file_path TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  issued_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_certs_student ON certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_certs_skill ON certificates(skill_id);
CREATE INDEX IF NOT EXISTS idx_certs_number ON certificates(certificate_number);

-- Foreign Key to certificates
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_ssa_certificate') THEN
    ALTER TABLE student_skill_access
      ADD CONSTRAINT fk_ssa_certificate
      FOREIGN KEY (certificate_id) REFERENCES certificates(id);
  END IF;
END $$;

-- TABLE: roadmaps
CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TABLE: roadmap_skills
CREATE TABLE IF NOT EXISTS roadmap_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(roadmap_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_rs_roadmap ON roadmap_skills(roadmap_id);

-- TABLE: student_activity
CREATE TABLE IF NOT EXISTS student_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sa_student ON student_activity(student_id);
CREATE INDEX IF NOT EXISTS idx_sa_created ON student_activity(created_at DESC);

-- TABLE: admin_actions
CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_aa_admin ON admin_actions(admin_id);

-- TABLE: pricing_rules
CREATE TABLE IF NOT EXISTS pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  skill_count INTEGER NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TABLE: platform_settings
CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skill_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Drop and recreate policies to ensure clean state
DROP POLICY IF EXISTS "profiles_admin_all" ON profiles;
CREATE POLICY "profiles_admin_all" ON profiles FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "profiles_student_read_own" ON profiles;
CREATE POLICY "profiles_student_read_own" ON profiles FOR SELECT TO authenticated USING (id = auth.uid());

DROP POLICY IF EXISTS "profiles_student_update_own" ON profiles;
CREATE POLICY "profiles_student_update_own" ON profiles FOR UPDATE TO authenticated USING (id = auth.uid() AND NOT is_admin()) WITH CHECK (id = auth.uid() AND role = 'student');

DROP POLICY IF EXISTS "branches_read_active" ON branches;
CREATE POLICY "branches_read_active" ON branches FOR SELECT TO authenticated USING (is_active = true OR is_admin());

DROP POLICY IF EXISTS "branches_admin_all" ON branches;
CREATE POLICY "branches_admin_all" ON branches FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "courses_read_active" ON courses;
CREATE POLICY "courses_read_active" ON courses FOR SELECT TO authenticated USING (is_active = true OR is_admin());

DROP POLICY IF EXISTS "courses_admin_all" ON courses;
CREATE POLICY "courses_admin_all" ON courses FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "skills_read_active" ON skills;
CREATE POLICY "skills_read_active" ON skills FOR SELECT TO authenticated USING (is_active = true OR is_admin());

DROP POLICY IF EXISTS "skills_admin_all" ON skills;
CREATE POLICY "skills_admin_all" ON skills FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "lessons_student_read" ON lessons;
CREATE POLICY "lessons_student_read" ON lessons FOR SELECT TO authenticated
  USING (
    is_admin() OR
    EXISTS (
      SELECT 1 FROM student_skill_access ssa
      WHERE ssa.student_id = auth.uid() AND ssa.skill_id = lessons.skill_id AND ssa.status IN ('active', 'completed') AND (ssa.access_expiry_date IS NULL OR ssa.access_expiry_date > now())
    )
  );

DROP POLICY IF EXISTS "lessons_admin_all" ON lessons;
CREATE POLICY "lessons_admin_all" ON lessons FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "lr_student_read" ON lesson_resources;
CREATE POLICY "lr_student_read" ON lesson_resources FOR SELECT TO authenticated
  USING (
    is_admin() OR
    EXISTS (
      SELECT 1 FROM lessons l
      JOIN student_skill_access ssa ON ssa.skill_id = l.skill_id
      WHERE l.id = lesson_resources.lesson_id AND ssa.student_id = auth.uid() AND ssa.status IN ('active', 'completed') AND (ssa.access_expiry_date IS NULL OR ssa.access_expiry_date > now())
    )
  );

DROP POLICY IF EXISTS "lr_admin_all" ON lesson_resources;
CREATE POLICY "lr_admin_all" ON lesson_resources FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "ssa_student_read_own" ON student_skill_access;
CREATE POLICY "ssa_student_read_own" ON student_skill_access FOR SELECT TO authenticated USING (student_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "ssa_admin_all" ON student_skill_access;
CREATE POLICY "ssa_admin_all" ON student_skill_access FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "lp_student_read_own" ON lesson_progress;
CREATE POLICY "lp_student_read_own" ON lesson_progress FOR SELECT TO authenticated USING (student_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "lp_student_insert_own" ON lesson_progress;
CREATE POLICY "lp_student_insert_own" ON lesson_progress FOR INSERT TO authenticated
  WITH CHECK (
    student_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM student_skill_access ssa
      WHERE ssa.student_id = auth.uid() AND ssa.skill_id = lesson_progress.skill_id AND ssa.status IN ('active', 'completed') AND (ssa.access_expiry_date IS NULL OR ssa.access_expiry_date > now())
    )
  );

DROP POLICY IF EXISTS "lp_student_update_own" ON lesson_progress;
CREATE POLICY "lp_student_update_own" ON lesson_progress FOR UPDATE TO authenticated USING (student_id = auth.uid()) WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "lp_admin_all" ON lesson_progress;
CREATE POLICY "lp_admin_all" ON lesson_progress FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "questions_student_read" ON questions;
CREATE POLICY "questions_student_read" ON questions FOR SELECT TO authenticated
  USING (
    is_admin() OR
    EXISTS (
      SELECT 1 FROM student_skill_access ssa
      WHERE ssa.student_id = auth.uid() AND ssa.skill_id = questions.skill_id AND ssa.status IN ('active', 'completed') AND (ssa.access_expiry_date IS NULL OR ssa.access_expiry_date > now())
    )
  );

DROP POLICY IF EXISTS "questions_admin_all" ON questions;
CREATE POLICY "questions_admin_all" ON questions FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "qa_student_read_own" ON quiz_attempts;
CREATE POLICY "qa_student_read_own" ON quiz_attempts FOR SELECT TO authenticated USING (student_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "qa_student_insert_own" ON quiz_attempts;
CREATE POLICY "qa_student_insert_own" ON quiz_attempts FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "qa_admin_all" ON quiz_attempts;
CREATE POLICY "qa_admin_all" ON quiz_attempts FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "qans_student_read_own" ON quiz_answers;
CREATE POLICY "qans_student_read_own" ON quiz_answers FOR SELECT TO authenticated
  USING (
    is_admin() OR
    EXISTS (
      SELECT 1 FROM quiz_attempts qa
      WHERE qa.id = quiz_answers.attempt_id AND qa.student_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "qans_student_insert_own" ON quiz_answers;
CREATE POLICY "qans_student_insert_own" ON quiz_answers FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quiz_attempts qa
      WHERE qa.id = quiz_answers.attempt_id AND qa.student_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "qans_admin_all" ON quiz_answers;
CREATE POLICY "qans_admin_all" ON quiz_answers FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "payments_student_read_own" ON payments;
CREATE POLICY "payments_student_read_own" ON payments FOR SELECT TO authenticated USING (student_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "payments_admin_all" ON payments;
CREATE POLICY "payments_admin_all" ON payments FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "certs_student_read_own" ON certificates;
CREATE POLICY "certs_student_read_own" ON certificates FOR SELECT TO authenticated USING (student_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "certs_admin_all" ON certificates;
CREATE POLICY "certs_admin_all" ON certificates FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "ct_read" ON certificate_templates;
CREATE POLICY "ct_read" ON certificate_templates FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "ct_admin_all" ON certificate_templates;
CREATE POLICY "ct_admin_all" ON certificate_templates FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "roadmaps_read_active" ON roadmaps;
CREATE POLICY "roadmaps_read_active" ON roadmaps FOR SELECT TO authenticated USING (is_active = true OR is_admin());

DROP POLICY IF EXISTS "roadmaps_admin_all" ON roadmaps;
CREATE POLICY "roadmaps_admin_all" ON roadmaps FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "rs_read" ON roadmap_skills;
CREATE POLICY "rs_read" ON roadmap_skills FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "rs_admin_all" ON roadmap_skills;
CREATE POLICY "rs_admin_all" ON roadmap_skills FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "sa_student_read_own" ON student_activity;
CREATE POLICY "sa_student_read_own" ON student_activity FOR SELECT TO authenticated USING (student_id = auth.uid() OR is_admin());

DROP POLICY IF EXISTS "sa_student_insert_own" ON student_activity;
CREATE POLICY "sa_student_insert_own" ON student_activity FOR INSERT TO authenticated WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "sa_admin_all" ON student_activity;
CREATE POLICY "sa_admin_all" ON student_activity FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "aa_admin_all" ON admin_actions;
CREATE POLICY "aa_admin_all" ON admin_actions FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "pr_read_active" ON pricing_rules;
CREATE POLICY "pr_read_active" ON pricing_rules FOR SELECT TO authenticated USING (is_active = true OR is_admin());

DROP POLICY IF EXISTS "pr_admin_all" ON pricing_rules;
CREATE POLICY "pr_admin_all" ON pricing_rules FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "ps_read" ON platform_settings;
CREATE POLICY "ps_read" ON platform_settings FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "ps_admin_all" ON platform_settings;
CREATE POLICY "ps_admin_all" ON platform_settings FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- 4. BUSINESS LOGIC FUNCTIONS & TRIGGERS
-- ============================================================

-- Function: Auto-check completion
CREATE OR REPLACE FUNCTION check_skill_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_skill_id UUID;
  v_total_required INTEGER;
  v_completed INTEGER;
  v_requirements JSONB;
  v_min_pct NUMERIC;
  v_quiz_required BOOLEAN;
  v_min_quiz_pct NUMERIC;
  v_best_quiz_score NUMERIC;
  v_is_complete BOOLEAN := false;
BEGIN
  IF NEW.is_completed = true AND (OLD.is_completed IS NULL OR OLD.is_completed = false) THEN
    v_skill_id := NEW.skill_id;

    SELECT completion_requirements INTO v_requirements
    FROM skills WHERE id = v_skill_id;

    v_min_pct := COALESCE((v_requirements->>'min_lessons_completed_pct')::numeric, 100);
    v_quiz_required := COALESCE((v_requirements->>'quiz_required')::boolean, false);
    v_min_quiz_pct := (v_requirements->>'min_quiz_score_pct')::numeric;

    SELECT COUNT(*) INTO v_total_required
    FROM lessons WHERE skill_id = v_skill_id AND is_required = true AND is_active = true;

    SELECT COUNT(*) INTO v_completed
    FROM lesson_progress lp
    JOIN lessons l ON l.id = lp.lesson_id
    WHERE lp.student_id = NEW.student_id
      AND lp.skill_id = v_skill_id
      AND lp.is_completed = true
      AND l.is_required = true
      AND l.is_active = true;

    IF v_total_required > 0 AND (v_completed::numeric / v_total_required * 100) >= v_min_pct THEN
      v_is_complete := true;
    ELSIF v_total_required = 0 THEN
      v_is_complete := true;
    END IF;

    IF v_is_complete AND v_quiz_required AND v_min_quiz_pct IS NOT NULL THEN
      SELECT MAX(
        CASE WHEN total_marks > 0 THEN (score::numeric / total_marks * 100) ELSE 0 END
      ) INTO v_best_quiz_score
      FROM quiz_attempts
      WHERE student_id = NEW.student_id AND skill_id = v_skill_id AND completed_at IS NOT NULL;

      IF v_best_quiz_score IS NULL OR v_best_quiz_score < v_min_quiz_pct THEN
        v_is_complete := false;
      END IF;
    END IF;

    IF v_is_complete THEN
      UPDATE student_skill_access
      SET status = 'completed',
          completion_date = now(),
          access_expiry_date = now() + interval '6 months'
      WHERE student_id = NEW.student_id
        AND skill_id = v_skill_id
        AND status = 'active';

      UPDATE certificates
      SET status = 'unlocked',
          issued_at = now()
      WHERE student_id = NEW.student_id
        AND skill_id = v_skill_id
        AND status = 'generated';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_check_skill_completion ON lesson_progress;
CREATE TRIGGER trigger_check_skill_completion
  AFTER UPDATE ON lesson_progress
  FOR EACH ROW EXECUTE FUNCTION check_skill_completion();

-- Function: Auto create profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function: Generate certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.certificate_number IS NULL OR NEW.certificate_number = '' THEN
    NEW.certificate_number := 'CF-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || 
      UPPER(SUBSTRING(gen_random_uuid()::text FROM 1 FOR 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_cert_number ON certificates;
CREATE TRIGGER trigger_generate_cert_number
  BEFORE INSERT ON certificates
  FOR EACH ROW EXECUTE FUNCTION generate_certificate_number();

-- ============================================================
-- 5. STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('lesson-videos', 'lesson-videos', false),
  ('lesson-resources', 'lesson-resources', false),
  ('certificates', 'certificates', true),
  ('certificate-templates', 'certificate-templates', false),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 6. POPULATE INITIAL SEED DATA
-- ============================================================

TRUNCATE TABLE 
  roadmap_skills,
  roadmaps,
  questions,
  lesson_resources,
  lesson_progress,
  lessons,
  skills,
  courses,
  branches,
  pricing_rules,
  platform_settings,
  certificate_templates
CASCADE;

-- BRANCHES
INSERT INTO branches (id, name, slug, description, icon, sort_order) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'CSE Core', 'cse-core', 'Fundamental computer science subjects every engineer must master.', '💻', 1),
  ('b1000000-0000-0000-0000-000000000002', 'CSE AI & ML', 'cse-ai-ml', 'Artificial Intelligence and Machine Learning specialization.', '🤖', 2),
  ('b1000000-0000-0000-0000-000000000003', 'CSE Data Science', 'cse-data-science', 'Data Science, analytics, and visualization.', '📊', 3),
  ('b1000000-0000-0000-0000-000000000004', 'CSE Cyber Security', 'cse-cyber-security', 'Cyber security, ethical hacking, and digital forensics.', '🔒', 4);

-- COURSES
INSERT INTO courses (id, branch_id, name, slug, description, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Core Programming', 'core-programming', 'Foundational programming and problem-solving skills.', 1),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'Core Systems', 'core-systems', 'Operating systems, networks, and architecture.', 2),
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'Software Development', 'software-development', 'Software engineering principles and OOP.', 3),
  ('c2000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'Machine Learning', 'machine-learning', 'Complete machine learning from basics to advanced.', 1),
  ('c2000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'Deep Learning & AI', 'deep-learning-ai', 'Neural networks, NLP, and computer vision.', 2),
  ('c3000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000003', 'Data Analysis', 'data-analysis', 'Data analysis, visualization, and reporting.', 1),
  ('c3000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000003', 'ML for Data Science', 'ml-data-science', 'Machine learning applications in data science.', 2),
  ('c4000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000004', 'Security Fundamentals', 'security-fundamentals', 'Core security concepts and practices.', 1),
  ('c4000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000004', 'Offensive Security', 'offensive-security', 'Ethical hacking and penetration testing.', 2);

-- SKILLS
INSERT INTO skills (id, course_id, name, slug, description, short_description, price, sort_order, estimated_hours, difficulty) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Programming', 'programming', 'Learn programming fundamentals with C and problem-solving techniques.', 'Master programming basics and problem-solving.', 500, 1, 40, 'beginner'),
  ('a1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Data Structures & Algorithms', 'dsa', 'Master essential data structures and algorithms for interviews and real-world applications.', 'Arrays, linked lists, trees, graphs, sorting, searching.', 500, 2, 60, 'intermediate'),
  ('a1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'DBMS', 'dbms', 'Database management systems — SQL, normalization, transactions.', 'Master database design and SQL.', 500, 3, 30, 'intermediate'),
  ('a1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'Operating Systems', 'operating-systems', 'Processes, threads, memory management, file systems.', 'Understand how operating systems work.', 500, 1, 35, 'intermediate'),
  ('a1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000002', 'Computer Networks', 'computer-networks', 'OSI model, TCP/IP, routing, protocols.', 'Learn networking fundamentals.', 500, 2, 30, 'intermediate'),
  ('a1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000002', 'Computer Architecture', 'computer-architecture', 'CPU design, memory hierarchy, pipelining.', 'Understand computer hardware architecture.', 500, 3, 25, 'advanced'),
  ('a1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000003', 'Object-Oriented Programming', 'oop', 'OOP concepts with Java — classes, inheritance, polymorphism.', 'Master OOP principles with Java.', 500, 1, 35, 'beginner'),
  ('a1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000003', 'Software Engineering', 'software-engineering', 'SDLC, agile, testing, design patterns.', 'Learn professional software development.', 500, 2, 30, 'intermediate'),

  ('a2000000-0000-0000-0000-000000000001', 'c2000000-0000-0000-0000-000000000001', 'Python', 'python-ml', 'Python programming for data science and machine learning.', 'The language of AI/ML. Start here.', 500, 1, 30, 'beginner'),
  ('a2000000-0000-0000-0000-000000000002', 'c2000000-0000-0000-0000-000000000001', 'NumPy', 'numpy', 'Numerical computing with NumPy — arrays, operations, linear algebra.', 'Master numerical computing.', 500, 2, 15, 'beginner'),
  ('a2000000-0000-0000-0000-000000000003', 'c2000000-0000-0000-0000-000000000001', 'Pandas', 'pandas', 'Data manipulation and analysis with Pandas.', 'The essential data manipulation library.', 500, 3, 20, 'beginner'),
  ('a2000000-0000-0000-0000-000000000004', 'c2000000-0000-0000-0000-000000000001', 'Mathematics', 'mathematics-ml', 'Linear algebra, calculus, and probability for ML.', 'The math behind machine learning.', 500, 4, 25, 'intermediate'),
  ('a2000000-0000-0000-0000-000000000005', 'c2000000-0000-0000-0000-000000000001', 'Statistics', 'statistics-ml', 'Statistical methods for data analysis and ML.', 'Descriptive and inferential statistics.', 500, 5, 20, 'intermediate'),
  ('a2000000-0000-0000-0000-000000000006', 'c2000000-0000-0000-0000-000000000001', 'Scikit-learn', 'scikit-learn', 'Machine learning with scikit-learn — classification, regression, clustering.', 'The go-to ML library in Python.', 500, 6, 25, 'intermediate'),
  ('a2000000-0000-0000-0000-000000000007', 'c2000000-0000-0000-0000-000000000001', 'Data Preprocessing', 'data-preprocessing', 'Data cleaning, feature engineering, and transformation.', 'Prepare data for ML models.', 500, 7, 15, 'intermediate'),
  ('a2000000-0000-0000-0000-000000000008', 'c2000000-0000-0000-0000-000000000001', 'ML Algorithms', 'ml-algorithms', 'In-depth study of classification, regression, and clustering algorithms.', 'Core ML algorithms explained.', 500, 8, 35, 'intermediate'),
  ('a2000000-0000-0000-0000-000000000009', 'c2000000-0000-0000-0000-000000000001', 'Model Evaluation', 'model-evaluation', 'Metrics, cross-validation, hyperparameter tuning.', 'Evaluate and improve your models.', 500, 9, 15, 'intermediate'),
  ('a2000000-0000-0000-0000-000000000010', 'c2000000-0000-0000-0000-000000000002', 'Deep Learning', 'deep-learning', 'Neural networks, CNNs, RNNs with TensorFlow/PyTorch.', 'Build deep neural networks.', 500, 1, 40, 'advanced'),
  ('a2000000-0000-0000-0000-000000000011', 'c2000000-0000-0000-0000-000000000002', 'NLP', 'nlp', 'Natural Language Processing — text processing, transformers, BERT.', 'Teach machines to understand language.', 500, 2, 30, 'advanced'),
  ('a2000000-0000-0000-0000-000000000012', 'c2000000-0000-0000-0000-000000000002', 'Computer Vision', 'computer-vision', 'Image processing, object detection, image classification.', 'Teach machines to see.', 500, 3, 30, 'advanced'),

  ('a3000000-0000-0000-0000-000000000001', 'c3000000-0000-0000-0000-000000000001', 'Python for Data Science', 'python-ds', 'Python fundamentals tailored for data science.', 'Python for data analysis workflows.', 500, 1, 25, 'beginner'),
  ('a3000000-0000-0000-0000-000000000002', 'c3000000-0000-0000-0000-000000000001', 'SQL', 'sql', 'SQL for data extraction, joins, aggregations.', 'Query databases like a pro.', 500, 2, 20, 'beginner'),
  ('a3000000-0000-0000-0000-000000000003', 'c3000000-0000-0000-0000-000000000001', 'Statistics for DS', 'statistics-ds', 'Descriptive and inferential statistics for data science.', 'The foundation of data science.', 500, 3, 20, 'intermediate'),
  ('a3000000-0000-0000-0000-000000000004', 'c3000000-0000-0000-0000-000000000001', 'Data Visualization', 'data-visualization', 'Matplotlib, balance and chart tools.', 'Tell stories with data.', 500, 4, 15, 'beginner'),
  ('a3000000-0000-0000-0000-000000000005', 'c3000000-0000-0000-0000-000000000001', 'Data Analysis', 'data-analysis', 'EDA, hypothesis testing, and data-driven decision making.', 'Extract insights from data.', 500, 5, 25, 'intermediate'),
  ('a3000000-0000-0000-0000-000000000006', 'c3000000-0000-0000-0000-000000000002', 'ML Basics for DS', 'ml-basics-ds', 'Machine learning fundamentals for data scientists.', 'Apply ML to real-world data.', 500, 1, 25, 'intermediate'),
  ('a3000000-0000-0000-0000-000000000007', 'c3000000-0000-0000-0000-000000000001', 'Power BI', 'power-bi', 'Business intelligence dashboards with Power BI.', 'Create interactive dashboards.', 500, 6, 20, 'beginner'),

  ('a4000000-0000-0000-0000-000000000001', 'c4000000-0000-0000-0000-000000000001', 'Linux', 'linux', 'Linux command line, administration, and scripting.', 'Master the Linux terminal.', 500, 1, 25, 'beginner'),
  ('a4000000-0000-0000-0000-000000000002', 'c4000000-0000-0000-0000-000000000001', 'Computer Networks for Security', 'networks-security', 'Networking fundamentals essential for cybersecurity.', 'Understand network protocols and architecture.', 500, 2, 25, 'intermediate'),
  ('a4000000-0000-0000-0000-000000000003', 'c4000000-0000-0000-0000-000000000001', 'Cryptography', 'cryptography', 'Encryption, hashing, digital signatures, PKI.', 'The science of secure communication.', 500, 3, 20, 'intermediate'),
  ('a4000000-0000-0000-0000-000000000004', 'c4000000-0000-0000-0000-000000000001', 'Cyber Security Fundamentals', 'cs-fundamentals', 'CIA triad, threat modeling, security policies.', 'Core security concepts every professional needs.', 500, 4, 20, 'beginner'),
  ('a4000000-0000-0000-0000-000000000005', 'c4000000-0000-0000-0000-000000000002', 'Web Security', 'web-security', 'OWASP Top 10, XSS, SQL injection, CSRF.', 'Secure web applications.', 500, 1, 25, 'intermediate'),
  ('a4000000-0000-0000-0000-000000000006', 'c4000000-0000-0000-0000-000000000002', 'Digital Forensics', 'digital-forensics', 'Evidence collection, analysis, and reporting.', 'Investigate cyber crimes.', 500, 2, 20, 'advanced'),
  ('a4000000-0000-0000-0000-000000000007', 'c4000000-0000-0000-0000-000000000002', 'Ethical Hacking', 'ethical-hacking', 'Penetration testing methodology and tools.', 'Think like a hacker, act like a defender.', 500, 3, 35, 'advanced'),
  ('a4000000-0000-0000-0000-000000000008', 'c4000000-0000-0000-0000-000000000002', 'Security Tools', 'security-tools', 'Nmap, Wireshark, Metasploit, Burp Suite.', 'Hands-on with industry tools.', 500, 4, 20, 'intermediate');

-- LESSONS
INSERT INTO lessons (id, skill_id, title, description, notes_content, sort_order, duration_minutes, is_required) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000001', 'Introduction to Python', 'Welcome to Python — setup, first program, and basic concepts.', 'Python is a high-level, interpreted programming language known for its simplicity and readability.\n\n## Getting Started\n\n1. Install Python from python.org\n2. Set up your IDE (VS Code recommended)\n3. Write your first program:\n\n```python\nprint("Hello, World!")\n```\n\n## Key Features\n- Easy to learn\n- Versatile\n- Large community\n- Extensive libraries', 1, 30, true),
  ('e1000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000001', 'Variables and Data Types', 'Integers, floats, strings, booleans, and type conversion.', 'Python has several built-in data types:\n\n## Numbers\n- int: Whole numbers (1, 42, -7)\n- float: Decimal numbers (3.14, -0.5)\n\n## Strings\nText enclosed in quotes: "Hello" or ''World''\n\n## Booleans\nTrue or False values\n\n## Type Conversion\n```python\nx = int("42")     # String to int\ny = float("3.14") # String to float\nz = str(42)       # Int to string\n```', 2, 25, true),
  ('e1000000-0000-0000-0000-000000000003', 'a2000000-0000-0000-0000-000000000001', 'Control Flow', 'If-else, loops, and conditional expressions.', 'Control flow determines the order in which code is executed.\n\n## If-Else\n```python\nif x > 0:\n    print("Positive")\nelif x == 0:\n    print("Zero")\nelse:\n    print("Negative")\n```\n\n## For Loop\n```python\nfor i in range(5):\n    print(i)\n```\n\n## While Loop\n```python\nwhile count < 10:\n    count += 1\n```', 3, 30, true),
  ('e1000000-0000-0000-0000-000000000004', 'a2000000-0000-0000-0000-000000000001', 'Functions', 'Defining functions, parameters, return values, lambda functions.', 'Functions are reusable blocks of code.\n\n## Defining Functions\n```python\ndef greet(name):\n    return f"Hello, {name}!"\n\nresult = greet("Alice")\nprint(result)  # Hello, Alice!\n```\n\n## Default Parameters\n```python\ndef power(base, exp=2):\n    return base ** exp\n```\n\n## Lambda Functions\n```python\nsquare = lambda x: x ** 2\n```', 4, 35, true),
  ('e1000000-0000-0000-0000-000000000005', 'a2000000-0000-0000-0000-000000000001', 'Lists and Tuples', 'Working with sequences — indexing, slicing, methods.', 'Lists and tuples are ordered collections.\n\n## Lists (mutable)\n```python\nfruits = ["apple", "banana", "cherry"]\nfruits.append("date")\nfruits[0] = "avocado"\n```\n\n## Tuples (immutable)\n```python\ncoords = (10, 20)\nx, y = coords  # Unpacking\n```\n\n## List Comprehensions\n```python\nsquares = [x**2 for x in range(10)]\n```', 5, 25, true),
  ('e1000000-0000-0000-0000-000000000006', 'a2000000-0000-0000-0000-000000000001', 'Dictionaries and Sets', 'Key-value pairs and unique collections.', 'Dictionaries store key-value pairs. Sets store unique values.\n\n## Dictionaries\n```python\nstudent = {\n    "name": "Rahul",\n    "age": 20,\n    "branch": "CSE"\n}\nprint(student["name"])\n```\n\n## Sets\n```python\nunique_nums = {1, 2, 3, 3, 4}  # {1, 2, 3, 4}\n```', 6, 25, true);

INSERT INTO lessons (id, skill_id, title, description, notes_content, sort_order, duration_minutes, is_required) VALUES
  ('e2000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000003', 'Introduction to Pandas', 'What is Pandas and why it matters for data science.', 'Pandas is the most popular data manipulation library in Python.\n\n## Installation\n```python\npip install pandas\n```\n\n## Import\n```python\nimport pandas as pd\n```\n\n## Key Data Structures\n- **Series**: 1D labeled array\n- **DataFrame**: 2D labeled table', 1, 20, true),
  ('e2000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000003', 'DataFrames Basics', 'Creating, reading, and exploring DataFrames.', 'DataFrames are the core of Pandas.\n\n## Creating DataFrames\n```python\ndf = pd.DataFrame({\n    "Name": ["Alice", "Bob"],\n    "Age": [25, 30]\n})\n```\n\n## Reading Data\n```python\ndf = pd.read_csv("data.csv")\ndf = pd.read_excel("data.xlsx")\n```\n\n## Exploring\n```python\ndf.head()\ndf.info()\ndf.describe()\n```', 2, 30, true),
  ('e2000000-0000-0000-0000-000000000003', 'a2000000-0000-0000-0000-000000000003', 'Data Selection and Filtering', 'Selecting columns, filtering rows, and boolean indexing.', '## Selecting Columns\n```python\ndf["Name"]          # Single column\ndf[["Name", "Age"]]  # Multiple columns\n```\n\n## Filtering Rows\n```python\ndf[df["Age"] > 25]\ndf.query("Age > 25")\n```\n\n## loc and iloc\n```python\ndf.loc[0, "Name"]    # Label-based\ndf.iloc[0, 0]        # Position-based\n```', 3, 25, true);

-- QUESTIONS
INSERT INTO questions (id, skill_id, lesson_id, question_text, question_type, options, correct_answer, explanation, difficulty, marks, sort_order) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'What is Python?', 'mcq', '[{"id": "a", "text": "A compiled programming language"}, {"id": "b", "text": "An interpreted high-level programming language"}, {"id": "c", "text": "A markup language"}, {"id": "d", "text": "A database query language"}]', 'b', 'Python is an interpreted, high-level, general-purpose programming language.', 'easy', 1, 1),
  ('d1000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000002', 'Which of the following is NOT a Python data type?', 'mcq', '[{"id": "a", "text": "int"}, {"id": "b", "text": "float"}, {"id": "c", "text": "char"}, {"id": "d", "text": "str"}]', 'c', 'Python does not have a char type. Single characters are strings of length 1.', 'easy', 1, 2),
  ('d1000000-0000-0000-0000-000000000003', 'a2000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'What is the output of: def f(x=2): return x*3\nf()', 'mcq', '[{"id": "a", "text": "6"}, {"id": "b", "text": "3"}, {"id": "c", "text": "Error"}, {"id": "d", "text": "None"}]', 'a', 'The function uses the default parameter x=2, so it returns 2*3 = 6.', 'medium', 1, 3),
  ('d1000000-0000-0000-0000-000000000004', 'a2000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000005', 'Which method adds an element to the end of a list?', 'mcq', '[{"id": "a", "text": "add()"}, {"id": "b", "text": "append()"}, {"id": "c", "text": "push()"}, {"id": "d", "text": "insert()"}]', 'b', 'The append() method adds an element to the end of a list.', 'easy', 1, 4);

-- PRICING RULES
INSERT INTO pricing_rules (name, description, skill_count, price, is_active) VALUES
  ('Single Skill', 'Price for purchasing 1 skill', 1, 500, true),
  ('Double Skill', 'Discounted price for any 2 skills', 2, 799, true),
  ('Triple Skill', 'Discounted price for any 3 skills', 3, 1099, true),
  ('Five Skills', 'Best value for 5 skills', 5, 1799, true);

-- PLATFORM SETTINGS
INSERT INTO platform_settings (key, value) VALUES
  ('platform_name', '"CodeFundas"'),
  ('platform_tagline', '"Master Computer Science, One Skill at a Time"'),
  ('access_duration_months', '6'),
  ('admin_email', '"admin@codefundas.com"'),
  ('admin_phone', '"+91 9876543210"'),
  ('admin_whatsapp', '"+91 9876543210"');

-- ROADMAPS
INSERT INTO roadmaps (id, branch_id, name, description) VALUES
  ('f1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000002', 'Machine Learning Roadmap', 'The complete path from Python basics to advanced ML.');

-- ROADMAP SKILLS
INSERT INTO roadmap_skills (roadmap_id, skill_id, sort_order) VALUES
  ('f1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000001', 1),
  ('f1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000002', 2),
  ('f1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000003', 3),
  ('f1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000004', 4),
  ('f1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000005', 5),
  ('f1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000006', 6),
  ('f1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000007', 7),
  ('f1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000008', 8),
  ('f1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000009', 9),
  ('f1000000-0000-0000-0000-000000000001', 'a2000000-0000-0000-0000-000000000010', 10);

-- CERTIFICATE TEMPLATE
INSERT INTO certificate_templates (name, config, is_default) VALUES
  ('Default Template', '{"background_color": "#1a1a2e", "text_color": "#ffffff", "accent_color": "#3b82f6", "font": "Inter"}', true);
