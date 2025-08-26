"use client"

import { Button } from "@/components/ui/button"
import { useEffect,useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Code2,
  Database,
  Globe,
  Palette,
  MapPin,
  Building2,
  Star,
  TrendingUp,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// Mock data for skills
const extractedSkills = [
  { name: "JavaScript", category: "Programming", icon: Code2 },
  { name: "React", category: "Frontend", icon: Globe },
  { name: "Node.js", category: "Backend", icon: Database },
  { name: "TypeScript", category: "Programming", icon: Code2 },
  { name: "Python", category: "Programming", icon: Code2 },
  { name: "UI/UX Design", category: "Design", icon: Palette },
  { name: "SQL", category: "Database", icon: Database },
  { name: "AWS", category: "Cloud", icon: Globe },
]



interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  category?: string;
  created: string;
  matchscore: number;
}





export default function SkillsJobDashboard() {

const [jobs, setJobs] = useState<Job[]>([]);

   useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs"); // your API route
        console.log(res);
        const data = await res.json();
        setJobs(data.finaljobs || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
      }
    };

    
    fetchJobs();
  }, []);
  

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-7xl mx-auto "  style={{
      background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #1a1d23ff 100%)",
    }}>
      <div className="mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-foreground mb-1">Skills & Job Recommendations</h1>
        <p className="text-sm text-muted-foreground">Your personalized career dashboard based on extracted skills</p>
        
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0 ">
        {/* Left Side - Skills Section */}
        <div className="flex flex-col gap-4 min-h-0 overflow-hidden">
          <Card className="flex-1 min-h-0 flex flex-col  rounded-2xl ">
            <CardHeader className="flex-shrink-0 pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-4 w-4 text-primary" />
                Your Skills
              </CardTitle>
              <CardDescription className="text-sm">Skills extracted from your profile and experience</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto min-h-0 dark-scrollbar">
              <div className="space-y-3">
                {extractedSkills.map((skill, index) => {
                  const IconComponent = skill.icon
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-primary/10 flex-shrink-0">
                        <IconComponent className="h-3 w-3 text-primary rounded-2xl" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-sm text-foreground">{skill.name}</h4>
                        <p className="text-xs text-muted-foreground">{skill.category}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Skills Summary */}
          <Card className="flex-shrink-0 rounded-2xl ">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-accent" />
                Skills Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 rounded-2xl">
              <div className="grid grid-cols-2 gap-3 rounded-2xl">
                <div className="text-center p-3 bg-muted rounded-2xl">
                  <div className="text-xl font-bold text-primary">{extractedSkills.length}</div>
                  <div className="text-xs text-muted-foreground">Total Skills</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-2xl">
                  <div className="text-xl font-bold text-accent">
                    {extractedSkills.filter((s) => s.category === "Programming").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Programming Skills</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Job Recommendations */}
        <div className="flex flex-col min-h-0">
          <Card className="flex-1 min-h-0 flex flex-col rounded-2xl dark-scrollbar">
            <CardHeader className="flex-shrink-0 pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-4 w-4 text-primary" />
                Recommended Jobs
              </CardTitle>
              <CardDescription className="text-sm">Personalized job matches based on your skills</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto min-h-0 flex flex-col dark-scrollbar">
              <div className="space-y-3 flex-1">
                {jobs.map((job) => (
                  <Card key={job.id} className=" hover:shadow-md transition-shadow rounded-2xl dark-scrollbar ">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-base text-foreground truncate">{job.title}</h3>
                              <p className="text-sm text-muted-foreground truncate">{job.company}</p>
                            </div>
                            <div className="flex items-center gap-1 bg-white/95 text-black px-2 py-1 rounded-2xl flex-shrink-0">
                              <Star className="h-3 w-3 text-accent fill-current" />
                              <span className="text-xs font-medium text-accent">{job.matchscore}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1 rounded-2xl">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{job.location}</span>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground line-clamp-2">{job.description}</p>

                          

                          <div className="my-2"></div>

                          <div className="flex items-center justify-between pt-1 rounded-2xl">
                            
                            <Button size="sm" className="bg-primary hover:bg-primary/90 text-xs rounded-2xl">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-between pt-3 flex-shrink-0 ">
                <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent text-xs rounded-2xl">
                  <ChevronLeft className="h-3 w-3" />
                  Previous
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Page 1 of 3</span>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent text-xs rounded-2xl">
                  Next
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  )
}
