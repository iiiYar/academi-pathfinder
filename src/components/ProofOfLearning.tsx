import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Award, 
  Upload, 
  Users, 
  ExternalLink, 
  Plus, 
  Download,
  FileText,
  Link,
  Trophy,
  BookOpen
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  url?: string;
  fileUrl?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  technologies: string[];
  completedDate: string;
}

interface Influencer {
  id: string;
  name: string;
  platform: 'linkedin' | 'twitter' | 'youtube' | 'github' | 'other';
  profileUrl: string;
  field: string;
}

interface ProofOfLearningProps {
  courseId: string;
}

export function ProofOfLearning({ courseId }: ProofOfLearningProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: "1",
      name: "React Advanced Patterns Completion",
      issuer: "Udemy",
      issueDate: "2024-01-30",
      url: "https://udemy.com/certificate/UC-123456"
    }
  ]);

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "E-commerce Dashboard",
      description: "Built a comprehensive admin dashboard using React advanced patterns including compound components and render props.",
      url: "https://github.com/user/ecommerce-dashboard",
      technologies: ["React", "TypeScript", "Tailwind CSS", "React Query"],
      completedDate: "2024-01-28"
    }
  ]);

  const [influencers, setInfluencers] = useState<Influencer[]>([
    {
      id: "1",
      name: "Dan Abramov",
      platform: "twitter",
      profileUrl: "https://twitter.com/dan_abramov",
      field: "React Development"
    },
    {
      id: "2",
      name: "Kent C. Dodds",
      platform: "twitter",
      profileUrl: "https://twitter.com/kentcdodds",
      field: "Testing & React"
    }
  ]);

  const [showAddCertificate, setShowAddCertificate] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddInfluencer, setShowAddInfluencer] = useState(false);

  const getPlatformIcon = (platform: Influencer['platform']) => {
    switch (platform) {
      case 'linkedin':
        return '💼';
      case 'twitter':
        return '🐦';
      case 'youtube':
        return '📺';
      case 'github':
        return '⚡';
      default:
        return '🌐';
    }
  };

  const handleAddCertificate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newCertificate: Certificate = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      issuer: formData.get('issuer') as string,
      issueDate: formData.get('issueDate') as string,
      url: formData.get('url') as string || undefined,
    };
    setCertificates(prev => [...prev, newCertificate]);
    setShowAddCertificate(false);
    toast({
      title: "Certificate Added",
      description: "Your certificate has been added to your portfolio.",
    });
  };

  const handleAddProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const technologies = (formData.get('technologies') as string).split(',').map(t => t.trim());
    const newProject: Project = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      url: formData.get('url') as string || undefined,
      technologies,
      completedDate: formData.get('completedDate') as string,
    };
    setProjects(prev => [...prev, newProject]);
    setShowAddProject(false);
    toast({
      title: "Project Added",
      description: "Your project has been added to your portfolio.",
    });
  };

  const handleAddInfluencer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newInfluencer: Influencer = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      platform: formData.get('platform') as Influencer['platform'],
      profileUrl: formData.get('profileUrl') as string,
      field: formData.get('field') as string,
    };
    setInfluencers(prev => [...prev, newInfluencer]);
    setShowAddInfluencer(false);
    toast({
      title: "Influencer Added",
      description: "Professional contact has been added to your network.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Certificates Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-warning" />
              Certificates & Achievements
            </CardTitle>
            <Dialog open={showAddCertificate} onOpenChange={setShowAddCertificate}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Certificate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Certificate</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddCertificate} className="space-y-4">
                  <div>
                    <Label htmlFor="cert-name">Certificate Name</Label>
                    <Input id="cert-name" name="name" required placeholder="e.g., React Advanced Patterns" />
                  </div>
                  <div>
                    <Label htmlFor="cert-issuer">Issuer</Label>
                    <Input id="cert-issuer" name="issuer" required placeholder="e.g., Udemy, Coursera" />
                  </div>
                  <div>
                    <Label htmlFor="cert-date">Issue Date</Label>
                    <Input id="cert-date" name="issueDate" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="cert-url">Certificate URL (optional)</Label>
                    <Input id="cert-url" name="url" type="url" placeholder="https://..." />
                  </div>
                  <Button type="submit" className="w-full" variant="learning">Add Certificate</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No certificates added yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {certificates.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <Award className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{cert.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuer} • {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {cert.url && (
                    <Button variant="ghost" size="sm" onClick={() => window.open(cert.url, '_blank')}>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Capstone Projects
            </CardTitle>
            <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Capstone Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddProject} className="space-y-4">
                  <div>
                    <Label htmlFor="project-title">Project Title</Label>
                    <Input id="project-title" name="title" required placeholder="e.g., E-commerce Dashboard" />
                  </div>
                  <div>
                    <Label htmlFor="project-desc">Description</Label>
                    <Textarea id="project-desc" name="description" required 
                      placeholder="Describe what you built and how it demonstrates your learning..." />
                  </div>
                  <div>
                    <Label htmlFor="project-url">Project URL (optional)</Label>
                    <Input id="project-url" name="url" type="url" placeholder="https://github.com/..." />
                  </div>
                  <div>
                    <Label htmlFor="project-tech">Technologies (comma-separated)</Label>
                    <Input id="project-tech" name="technologies" required 
                      placeholder="React, TypeScript, Node.js" />
                  </div>
                  <div>
                    <Label htmlFor="project-date">Completion Date</Label>
                    <Input id="project-date" name="completedDate" type="date" required />
                  </div>
                  <Button type="submit" className="w-full" variant="learning">Add Project</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No projects added yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="p-4 border border-border/50 rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{project.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Completed: {new Date(project.completedDate).toLocaleDateString()}
                      </p>
                    </div>
                    {project.url && (
                      <Button variant="ghost" size="sm" onClick={() => window.open(project.url, '_blank')}>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Professional Network Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Professional Network ({influencers.length}/5)
            </CardTitle>
            <Dialog open={showAddInfluencer} onOpenChange={setShowAddInfluencer}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  disabled={influencers.length >= 5}
                >
                  <Plus className="w-4 h-4" />
                  Add Professional
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Professional Contact</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddInfluencer} className="space-y-4">
                  <div>
                    <Label htmlFor="inf-name">Name</Label>
                    <Input id="inf-name" name="name" required placeholder="e.g., Dan Abramov" />
                  </div>
                  <div>
                    <Label htmlFor="inf-platform">Platform</Label>
                    <select id="inf-platform" name="platform" required 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter</option>
                      <option value="youtube">YouTube</option>
                      <option value="github">GitHub</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="inf-url">Profile URL</Label>
                    <Input id="inf-url" name="profileUrl" type="url" required 
                      placeholder="https://linkedin.com/in/..." />
                  </div>
                  <div>
                    <Label htmlFor="inf-field">Field/Expertise</Label>
                    <Input id="inf-field" name="field" required 
                      placeholder="e.g., React Development, UX Design" />
                  </div>
                  <Button type="submit" className="w-full" variant="learning">Add Professional</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {influencers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No professional contacts added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {influencers.map((influencer) => (
                <div key={influencer.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getPlatformIcon(influencer.platform)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{influencer.name}</h4>
                      <p className="text-sm text-muted-foreground">{influencer.field}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => window.open(influencer.profileUrl, '_blank')}>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}