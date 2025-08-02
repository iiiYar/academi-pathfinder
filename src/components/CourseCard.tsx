import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Award, Calendar, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Course {
  id: string;
  title: string;
  description: string;
  platform: string;
  progress: number;
  totalHours: number;
  completedHours: number;
  totalLessons: number;
  completedLessons: number;
  startDate: string;
  dueDate?: string;
  category: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

interface CourseCardProps {
  course: Course;
  onView: (courseId: string) => void;
  onEdit: (courseId: string) => void;
  onDelete: (courseId: string) => void;
}

export function CourseCard({ course, onView, onEdit, onDelete }: CourseCardProps) {
  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'in-progress':
        return 'bg-warning text-warning-foreground';
      case 'not-started':
        return 'bg-progress-not-started text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-success';
    if (progress > 0) return 'bg-warning';
    return 'bg-progress-not-started';
  };

  return (
    <Card className="group hover:shadow-course-card transition-all duration-300 hover:scale-[1.02] animate-fade-in bg-gradient-subtle border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {course.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">{course.platform}</span>
              <span>•</span>
              <span>{course.category}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(course.status)} variant="secondary">
              {course.status.replace('-', ' ')}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(course.id)}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(course.id)}>
                  Edit Course
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(course.id)} className="text-destructive">
                  Delete Course
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
          {course.description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Progress</span>
            <span className="text-muted-foreground">{course.progress}%</span>
          </div>
          <Progress 
            value={course.progress} 
            className="h-2"
            style={{ '--progress-width': `${course.progress}%` } as React.CSSProperties}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <div>
              <div className="font-medium text-foreground">{course.completedHours}h / {course.totalHours}h</div>
              <div className="text-muted-foreground">Time spent</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4 text-accent" />
            <div>
              <div className="font-medium text-foreground">{course.completedLessons} / {course.totalLessons}</div>
              <div className="text-muted-foreground">Lessons</div>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Started {new Date(course.startDate).toLocaleDateString()}
          </div>
          {course.dueDate && (
            <div className="flex items-center gap-1">
              <Award className="w-3 h-3" />
              Due {new Date(course.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button 
          onClick={() => onView(course.id)}
          className="w-full mt-4" 
          variant="learning"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Continue Learning
        </Button>
      </CardContent>
    </Card>
  );
}