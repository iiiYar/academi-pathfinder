import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Upload,
  Download,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isAfter, differenceInDays } from "date-fns";

interface AssignmentFile {
  id: string;
  name: string;
  type: string;
  url: string;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'quiz' | 'essay' | 'exercise' | 'presentation';
  status: 'pending' | 'completed' | 'overdue';
  dueDate: string;
  submittedAt?: string;
  lessonId?: string;
  files: AssignmentFile[];
}

interface AssignmentCardProps {
  assignment: Assignment;
  onStatusChange: (assignmentId: string, status: Assignment['status']) => void;
}

export function AssignmentCard({ assignment, onStatusChange }: AssignmentCardProps) {
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = isAfter(new Date(), dueDate) && assignment.status === 'pending';
  const daysUntilDue = differenceInDays(dueDate, new Date());
  
  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'overdue':
        return 'bg-destructive text-destructive-foreground';
      case 'pending':
        return daysUntilDue <= 3 ? 'bg-warning text-warning-foreground' : 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getTypeIcon = (type: Assignment['type']) => {
    switch (type) {
      case 'project':
        return <FileText className="w-4 h-4" />;
      case 'quiz':
        return <CheckCircle className="w-4 h-4" />;
      case 'essay':
        return <BookOpen className="w-4 h-4" />;
      case 'exercise':
        return <AlertCircle className="w-4 h-4" />;
      case 'presentation':
        return <Upload className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getUrgencyMessage = () => {
    if (assignment.status === 'completed') {
      return `Submitted ${assignment.submittedAt ? format(new Date(assignment.submittedAt), 'MMM d') : ''}`;
    }
    if (isOverdue) {
      return `Overdue by ${Math.abs(daysUntilDue)} ${Math.abs(daysUntilDue) === 1 ? 'day' : 'days'}`;
    }
    if (daysUntilDue === 0) {
      return 'Due today';
    }
    if (daysUntilDue === 1) {
      return 'Due tomorrow';
    }
    if (daysUntilDue <= 7) {
      return `Due in ${daysUntilDue} days`;
    }
    return `Due ${format(dueDate, 'MMM d')}`;
  };

  return (
    <Card className={cn(
      "group transition-all duration-300 hover:shadow-course-card hover:scale-[1.01] animate-fade-in",
      assignment.status === 'completed' && "bg-success/5 border-success/20",
      isOverdue && "bg-destructive/5 border-destructive/20"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* Assignment Icon */}
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg",
              assignment.status === 'completed' 
                ? "bg-success/10 text-success" 
                : isOverdue
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary"
            )}>
              {getTypeIcon(assignment.type)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {assignment.title}
                </CardTitle>
                <Badge className={getStatusColor(assignment.status)} variant="secondary">
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {assignment.description}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Due Date & Status */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Due: {format(dueDate, 'MMM d, yyyy')}</span>
          </div>
          <div className={cn(
            "flex items-center gap-1 font-medium",
            assignment.status === 'completed' ? "text-success" : 
            isOverdue ? "text-destructive" :
            daysUntilDue <= 3 ? "text-warning" : "text-muted-foreground"
          )}>
            <Clock className="w-4 h-4" />
            {getUrgencyMessage()}
          </div>
        </div>

        {/* Assignment Type */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <span className="capitalize">{assignment.type}</span>
          </Badge>
          {assignment.lessonId && (
            <Badge variant="outline" className="text-xs">
              Lesson {assignment.lessonId}
            </Badge>
          )}
        </div>

        {/* Files Section */}
        {assignment.files.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Submitted Files
            </h4>
            <div className="flex flex-wrap gap-2">
              {assignment.files.map((file) => (
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

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-border/50">
          {assignment.status === 'pending' && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Work
              </Button>
              <Button 
                variant="learning" 
                size="sm" 
                className="flex-1 gap-2"
                onClick={() => onStatusChange(assignment.id, 'completed')}
              >
                <CheckCircle className="w-4 h-4" />
                Mark Complete
              </Button>
            </>
          )}
          
          {assignment.status === 'completed' && (
            <Button 
              variant="ghost" 
              className="w-full gap-2 text-success hover:text-success hover:bg-success/10"
            >
              <CheckCircle className="w-4 h-4" />
              View Submission
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}