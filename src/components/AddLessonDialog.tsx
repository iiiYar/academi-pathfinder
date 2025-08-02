import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen } from "lucide-react";

interface AddLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLesson: (lesson: any) => void;
}

export function AddLessonDialog({ open, onOpenChange, onAddLesson }: AddLessonDialogProps) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [duration, setDuration] = useState("");
  const [sourceLink, setSourceLink] = useState("");
  const [type, setType] = useState<'video' | 'article' | 'exercise' | 'quiz'>('video');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !summary || !duration) {
      return;
    }

    onAddLesson({
      title,
      summary,
      duration: parseInt(duration),
      sourceLink,
      type
    });

    // Reset form
    setTitle("");
    setSummary("");
    setDuration("");
    setSourceLink("");
    setType('video');
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-learning rounded-lg">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            Add New Lesson
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="lesson-title">Lesson Title *</Label>
            <Input
              id="lesson-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter lesson title"
              required
            />
          </div>

          <div>
            <Label htmlFor="lesson-type">Lesson Type</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="exercise">Exercise</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="lesson-duration">Duration (minutes) *</Label>
            <Input
              id="lesson-duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 45"
              min="1"
              required
            />
          </div>

          <div>
            <Label htmlFor="lesson-summary">Summary *</Label>
            <Textarea
              id="lesson-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief description of what this lesson covers..."
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="lesson-source">Source Link</Label>
            <Input
              id="lesson-source"
              type="url"
              value={sourceLink}
              onChange={(e) => setSourceLink(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="learning">
              Add Lesson
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}