import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  FileText, 
  Award,
  Plus,
  Play,
  CheckCircle,
  Calendar,
  Users,
  Target,
  TrendingUp,
  Upload
} from "lucide-react";
import { LessonCard } from "@/components/LessonCard";
import { AssignmentCard } from "@/components/AssignmentCard";
import { ProofOfLearning } from "@/components/ProofOfLearning";
import { AddLessonDialog } from "@/components/AddLessonDialog";
import { AddAssignmentDialog } from "@/components/AddAssignmentDialog";
import { toast } from "@/hooks/use-toast";

// Mock data for course details
const mockCourse = {
  id: "1",
  title: "React Advanced Patterns",
  description: "Master advanced React patterns including hooks, context, and performance optimization techniques for building scalable applications.",
  platform: "Udemy",
  instructor: "John Smith",
  category: "Programming",
  totalHours: 40,
  completedHours: 30,
  totalLessons: 25,
  completedLessons: 19,
  progress: 75,
  startDate: "2024-01-15",
  dueDate: "2024-02-15",
  status: "in-progress" as const,
  tags: ["React", "Hooks", "Performance", "Patterns"],
  rating: 4.8,
  difficulty: "Advanced"
};

const mockLessons = [
  {
    id: "1",
    title: "Introduction to Advanced React Patterns",
    summary: "Overview of design patterns and their importance in React applications",
    duration: 45,
    completedDuration: 45,
    sourceLink: "https://udemy.com/lesson1",
    completed: true,
    completedAt: "2024-01-16T10:30:00Z",
    type: "video" as const,
    files: [
      { id: "1", name: "intro-notes.pdf", type: "pdf", url: "/files/intro-notes.pdf" }
    ]
  },
  {
    id: "2", 
    title: "Compound Components Pattern",
    summary: "Learn to build flexible and reusable compound components",
    duration: 60,
    completedDuration: 35,
    sourceLink: "https://udemy.com/lesson2",
    completed: false,
    type: "video" as const,
    files: []
  },
  {
    id: "3",
    title: "Render Props and Higher-Order Components",
    summary: "Advanced composition patterns for sharing logic between components",
    duration: 75,
    completedDuration: 0,
    sourceLink: "https://udemy.com/lesson3",
    completed: false,
    type: "video" as const,
    files: []
  }
];

interface Assignment {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'quiz' | 'essay' | 'exercise' | 'presentation';
  status: 'pending' | 'completed' | 'overdue';
  dueDate: string;
  submittedAt?: string;
  lessonId?: string;
  files: { id: string; name: string; type: string; url: string; }[];
}

const mockAssignments: Assignment[] = [
  {
    id: "1",
    title: "Build a Compound Component Library",
    description: "Create a reusable UI library using compound component patterns",
    type: "project",
    status: "completed",
    dueDate: "2024-01-25",
    submittedAt: "2024-01-24T15:30:00Z",
    lessonId: "2",
    files: [
      { id: "1", name: "component-library.zip", type: "zip", url: "/files/library.zip" }
    ]
  },
  {
    id: "2",
    title: "Performance Optimization Quiz",
    description: "Test your understanding of React performance optimization techniques",
    type: "quiz",
    status: "pending",
    dueDate: "2024-02-10",
    lessonId: "5",
    files: []
  }
];

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState(mockLessons);
  const [assignments, setAssignments] = useState(mockAssignments);
  const [addLessonOpen, setAddLessonOpen] = useState(false);
  const [addAssignmentOpen, setAddAssignmentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("lessons");

  // Calculate statistics
  const stats = useMemo(() => {
    const totalTime = lessons.reduce((sum, l) => sum + l.completedDuration, 0);
    const completedLessons = lessons.filter(l => l.completed).length;
    const pendingAssignments = assignments.filter(a => a.status === 'pending').length;
    const completedAssignments = assignments.filter(a => a.status === 'completed').length;

    return {
      totalTime,
      completedLessons,
      pendingAssignments,
      completedAssignments,
      progressPercentage: Math.round((completedLessons / lessons.length) * 100)
    };
  }, [lessons, assignments]);

  const handleLessonComplete = (lessonId: string) => {
    setLessons(prev => prev.map(lesson => 
      lesson.id === lessonId 
        ? { ...lesson, completed: true, completedAt: new Date().toISOString(), completedDuration: lesson.duration }
        : lesson
    ));
    toast({
      title: "Lesson Completed!",
      description: "Great progress on your learning journey!",
    });
  };

  const handleAddLesson = (lessonData: any) => {
    const newLesson = {
      ...lessonData,
      id: Date.now().toString(),
      completed: false,
      completedDuration: 0,
      files: []
    };
    setLessons(prev => [...prev, newLesson]);
    toast({
      title: "Lesson Added",
      description: "New lesson has been added to the course.",
    });
  };

  const handleAddAssignment = (assignmentData: any) => {
    const newAssignment: Assignment = {
      ...assignmentData,
      id: Date.now().toString(),
      status: 'pending',
      files: []
    };
    setAssignments(prev => [...prev, newAssignment]);
    toast({
      title: "Assignment Added",
      description: "New assignment has been added to the course.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Courses
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-learning rounded-lg shadow-soft">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">{mockCourse.title}</h1>
                    <Badge variant="secondary">{mockCourse.status.replace('-', ' ')}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{mockCourse.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {mockCourse.instructor}
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {mockCourse.platform}
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {mockCourse.difficulty}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <Card className="bg-gradient-primary text-primary-foreground">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Course Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{stats.progressPercentage}%</span>
                  </div>
                  <Progress value={stats.progressPercentage} className="bg-white/20" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold">{stats.completedLessons}/{lessons.length}</div>
                    <div className="text-white/70">Lessons</div>
                  </div>
                  <div>
                    <div className="font-semibold">{Math.round(stats.totalTime / 60)}h</div>
                    <div className="text-white/70">Studied</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
            <TabsTrigger value="assignments">Tasks</TabsTrigger>
            <TabsTrigger value="progress">Analytics</TabsTrigger>
            <TabsTrigger value="proof">Portfolio</TabsTrigger>
          </TabsList>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Course Lessons</h2>
              <Button onClick={() => setAddLessonOpen(true)} variant="learning" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Lesson
              </Button>
            </div>

            <div className="grid gap-4">
              {lessons.map((lesson, index) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  lessonNumber={index + 1}
                  onMarkComplete={handleLessonComplete}
                  onPlay={() => window.open(lesson.sourceLink, '_blank')}
                />
              ))}
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Assignments & Assessments</h2>
                <p className="text-muted-foreground">{stats.pendingAssignments} pending, {stats.completedAssignments} completed</p>
              </div>
              <Button onClick={() => setAddAssignmentOpen(true)} variant="learning" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Assignment
              </Button>
            </div>

            <div className="grid gap-4">
              {assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onStatusChange={(id, status) => {
                    setAssignments(prev => prev.map(a => 
                      a.id === id ? { 
                        ...a, 
                        status: status, 
                        submittedAt: status === 'completed' ? new Date().toISOString() : a.submittedAt 
                      } : a
                    ));
                    toast({
                      title: "Assignment Updated",
                      description: `Assignment marked as ${status}`,
                    });
                  }}
                />
              ))}
            </div>
          </TabsContent>

          {/* Progress Analytics Tab */}
          <TabsContent value="progress" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Learning Analytics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Study Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{Math.round(stats.totalTime / 60)}h</div>
                  <p className="text-sm text-muted-foreground">Total hours studied</p>
                  <div className="mt-2 text-sm text-success">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +5h this week
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-accent" />
                    Completion Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">{stats.progressPercentage}%</div>
                  <p className="text-sm text-muted-foreground">Course completed</p>
                  <Progress value={stats.progressPercentage} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="w-5 h-5 text-warning" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">3</div>
                  <p className="text-sm text-muted-foreground">Milestones unlocked</p>
                  <div className="flex gap-1 mt-2">
                    <Badge variant="secondary" className="text-xs">Fast Learner</Badge>
                    <Badge variant="secondary" className="text-xs">Consistent</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Proof of Learning Tab */}
          <TabsContent value="proof" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Learning Portfolio</h2>
            <ProofOfLearning courseId={courseId!} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <AddLessonDialog
        open={addLessonOpen}
        onOpenChange={setAddLessonOpen}
        onAddLesson={handleAddLesson}
      />

      <AddAssignmentDialog
        open={addAssignmentOpen}
        onOpenChange={setAddAssignmentOpen}
        onAddAssignment={handleAddAssignment}
        lessons={lessons}
      />
    </div>
  );
};

export default CourseDetail;