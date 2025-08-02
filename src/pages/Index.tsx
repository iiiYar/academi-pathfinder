import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { CourseCard } from "@/components/CourseCard";
import { AddCourseDialog } from "@/components/AddCourseDialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Clock, 
  Award, 
  TrendingUp, 
  Filter,
  Grid3x3,
  List,
  Calendar
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data for courses
const initialCourses = [
  {
    id: "1",
    title: "React Advanced Patterns",
    description: "Master advanced React patterns including hooks, context, and performance optimization techniques for building scalable applications.",
    platform: "Udemy",
    progress: 75,
    totalHours: 40,
    completedHours: 30,
    totalLessons: 25,
    completedLessons: 19,
    startDate: "2024-01-15",
    dueDate: "2024-02-15",
    category: "Programming",
    status: "in-progress" as const
  },
  {
    id: "2",
    title: "Data Science with Python",
    description: "Comprehensive course covering pandas, numpy, matplotlib, and machine learning fundamentals for data analysis.",
    platform: "Coursera",
    progress: 100,
    totalHours: 60,
    completedHours: 60,
    totalLessons: 40,
    completedLessons: 40,
    startDate: "2023-11-01",
    dueDate: "2024-01-01",
    category: "Data Science",
    status: "completed" as const
  },
  {
    id: "3",
    title: "UI/UX Design Fundamentals",
    description: "Learn the principles of user interface and user experience design using modern tools and methodologies.",
    platform: "Skillshare",
    progress: 25,
    totalHours: 30,
    completedHours: 7.5,
    totalLessons: 20,
    completedLessons: 5,
    startDate: "2024-01-20",
    category: "Design",
    status: "in-progress" as const
  },
  {
    id: "4",
    title: "JavaScript ES2024 Features",
    description: "Explore the latest JavaScript features and modern development practices for efficient web development.",
    platform: "YouTube",
    progress: 0,
    totalHours: 15,
    completedHours: 0,
    totalLessons: 12,
    completedLessons: 0,
    startDate: "2024-02-01",
    category: "Programming",
    status: "not-started" as const
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState(initialCourses);
  const [searchQuery, setSearchQuery] = useState("");
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'not-started' | 'in-progress' | 'completed'>('all');

  // Filter and search courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [courses, searchQuery, filterStatus]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalCourses = courses.length;
    const completedCourses = courses.filter(c => c.status === 'completed').length;
    const inProgressCourses = courses.filter(c => c.status === 'in-progress').length;
    const totalHours = courses.reduce((sum, c) => sum + c.completedHours, 0);
    const averageProgress = totalCourses > 0 ? 
      Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / totalCourses) : 0;

    return {
      totalCourses,
      completedCourses,
      inProgressCourses,
      totalHours,
      averageProgress
    };
  }, [courses]);

  const handleAddCourse = (newCourse: any) => {
    const course = {
      ...newCourse,
      id: Date.now().toString(),
      progress: 0,
      completedHours: 0,
      completedLessons: 0
    };
    setCourses(prev => [...prev, course]);
    toast({
      title: "Course Added",
      description: `${course.title} has been added to your courses.`,
    });
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const handleEditCourse = (courseId: string) => {
    toast({
      title: "Edit Course",
      description: "Course editing coming soon!",
    });
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(c => c.id !== courseId));
    toast({
      title: "Course Deleted",
      description: "Course has been removed from your list.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header onAddCourse={() => setAddCourseOpen(true)} onSearch={setSearchQuery} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Courses"
            value={stats.totalCourses}
            subtitle="Enrolled courses"
            icon={BookOpen}
            variant="primary"
          />
          <StatsCard
            title="Completed"
            value={stats.completedCourses}
            subtitle="Finished courses"
            icon={Award}
            variant="success"
          />
          <StatsCard
            title="Study Hours"
            value={`${stats.totalHours}h`}
            subtitle="Time invested"
            icon={Clock}
            variant="accent"
          />
          <StatsCard
            title="Progress"
            value={`${stats.averageProgress}%`}
            subtitle="Average completion"
            icon={TrendingUp}
            trend={{ value: 12, isPositive: true }}
          />
        </section>

        {/* Course Management */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
              <p className="text-muted-foreground">Manage your learning journey</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Filter */}
              <Tabs value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="not-started">New</TabsTrigger>
                  <TabsTrigger value="in-progress">Active</TabsTrigger>
                  <TabsTrigger value="completed">Done</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* View Mode */}
              <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Course Grid/List */}
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? "No courses match your search criteria." : "Start your learning journey by adding your first course!"}
              </p>
              <Button onClick={() => setAddCourseOpen(true)} variant="learning">
                Add Your First Course
              </Button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onView={handleViewCourse}
                  onEdit={handleEditCourse}
                  onDelete={handleDeleteCourse}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <AddCourseDialog
        open={addCourseOpen}
        onOpenChange={setAddCourseOpen}
        onAddCourse={handleAddCourse}
      />
    </div>
  );
};

export default Index;
