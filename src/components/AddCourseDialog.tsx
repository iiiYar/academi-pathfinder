import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Course {
  id: string;
  title: string;
  description: string;
  platform: string;
  category: string;
  totalHours: number;
  totalLessons: number;
  startDate: string;
  dueDate?: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCourse: (course: Omit<Course, 'id' | 'progress' | 'completedHours' | 'completedLessons'>) => void;
}

const platforms = [
  "Coursera", "Udemy", "edX", "Khan Academy", "Pluralsight", 
  "YouTube", "LinkedIn Learning", "Skillshare", "Custom", "Other"
];

const categories = [
  "Programming", "Data Science", "Design", "Business", "Marketing",
  "Languages", "Mathematics", "Science", "Art", "Music", "Other"
];

export function AddCourseDialog({ open, onOpenChange, onAddCourse }: AddCourseDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [platform, setPlatform] = useState("");
  const [category, setCategory] = useState("");
  const [totalHours, setTotalHours] = useState("");
  const [totalLessons, setTotalLessons] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [dueDate, setDueDate] = useState<Date>();
  const [status, setStatus] = useState<Course['status']>('not-started');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !platform || !category || !startDate) {
      return;
    }

    onAddCourse({
      title,
      description,
      platform,
      category,
      totalHours: parseInt(totalHours) || 0,
      totalLessons: parseInt(totalLessons) || 0,
      startDate: startDate.toISOString(),
      dueDate: dueDate?.toISOString(),
      status
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPlatform("");
    setCategory("");
    setTotalHours("");
    setTotalLessons("");
    setStartDate(undefined);
    setDueDate(undefined);
    setStatus('not-started');
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-learning rounded-lg">
              <Plus className="w-4 h-4 text-white" />
            </div>
            Add New Course
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course Title */}
            <div className="md:col-span-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter course title"
                required
              />
            </div>

            {/* Platform */}
            <div>
              <Label htmlFor="platform">Platform *</Label>
              <Select value={platform} onValueChange={setPlatform} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Total Hours */}
            <div>
              <Label htmlFor="totalHours">Estimated Hours</Label>
              <Input
                id="totalHours"
                type="number"
                value={totalHours}
                onChange={(e) => setTotalHours(e.target.value)}
                placeholder="e.g. 40"
                min="0"
              />
            </div>

            {/* Total Lessons */}
            <div>
              <Label htmlFor="totalLessons">Total Lessons</Label>
              <Input
                id="totalLessons"
                type="number"
                value={totalLessons}
                onChange={(e) => setTotalLessons(e.target.value)}
                placeholder="e.g. 25"
                min="0"
              />
            </div>

            {/* Start Date */}
            <div>
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick start date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Due Date */}
            <div>
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Status */}
            <div className="md:col-span-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: Course['status']) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Course description, objectives, or notes..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="learning">
              Add Course
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}