import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  CheckCircle, 
  Clock, 
  FileText, 
  ExternalLink, 
  Download,
  PlayCircle,
  Timer
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonFile {
  id: string;
  name: string;
  type: string;
  url: string;
}

interface Lesson {
  id: string;
  title: string;
  summary: string;
  duration: number; // in minutes
  completedDuration: number;
  sourceLink: string;
  completed: boolean;
  completedAt?: string;
  type: 'video' | 'article' | 'exercise' | 'quiz';
  files: LessonFile[];
}

interface LessonCardProps {
  lesson: Lesson;
  lessonNumber: number;
  onMarkComplete: (lessonId: string) => void;
  onPlay: (lessonId: string) => void;
}

export function LessonCard({ lesson, lessonNumber, onMarkComplete, onPlay }: LessonCardProps) {
  const progressPercentage = lesson.duration > 0 ? Math.round((lesson.completedDuration / lesson.duration) * 100) : 0;
  
  const getTypeIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return <PlayCircle className="w-4 h-4" />;
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'exercise':
        return <Timer className="w-4 h-4" />;
      case 'quiz':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'article':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'exercise':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
      case 'quiz':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card className={cn(
      "group transition-all duration-300 hover:shadow-course-card hover:scale-[1.01] animate-fade-in",
      lesson.completed && "bg-success/5 border-success/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* Lesson Number */}
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold",
              lesson.completed 
                ? "bg-success text-success-foreground" 
                : "bg-primary/10 text-primary"
            )}>
              {lesson.completed ? <CheckCircle className="w-4 h-4" /> : lessonNumber}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {lesson.title}
                </CardTitle>
                <Badge className={cn("text-xs", getTypeColor(lesson.type))} variant="secondary">
                  {getTypeIcon(lesson.type)}
                  <span className="ml-1 capitalize">{lesson.type}</span>
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {lesson.summary}
              </p>

              {lesson.completed && lesson.completedAt && (
                <p className="text-xs text-success">
                  Completed on {new Date(lesson.completedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPlay(lesson.id)}
              className="gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open
            </Button>
            
            {!lesson.completed && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMarkComplete(lesson.id)}
                className="gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Complete
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{lesson.completedDuration} / {lesson.duration} minutes</span>
            </div>
            <span className="font-medium text-foreground">{progressPercentage}%</span>
          </div>
          
          <Progress 
            value={progressPercentage} 
            className={cn(
              "h-2 transition-all duration-300",
              lesson.completed && "bg-success/20"
            )}
          />
        </div>

        {/* Files Section */}
        {lesson.files.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Attached Files
            </h4>
            <div className="flex flex-wrap gap-2">
              {lesson.files.map((file) => (
                <Button
                  key={file.id}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-2"
                  onClick={() => window.open(file.url, '_blank')}
                >
                  <Download className="w-3 h-3" />
                  {file.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Primary Action */}
        <div className="pt-2 border-t border-border/50">
          {lesson.completed ? (
            <Button 
              variant="ghost" 
              className="w-full gap-2 text-success hover:text-success hover:bg-success/10"
              onClick={() => onPlay(lesson.id)}
            >
              <CheckCircle className="w-4 h-4" />
              Review Lesson
            </Button>
          ) : (
            <Button 
              variant="learning" 
              className="w-full gap-2"
              onClick={() => onPlay(lesson.id)}
            >
              <Play className="w-4 h-4" />
              {progressPercentage > 0 ? 'Continue' : 'Start'} Lesson
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}