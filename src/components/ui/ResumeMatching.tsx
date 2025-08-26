"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, ExternalLink, User, Mail, Lock } from "lucide-react"
import { toast } from "sonner";

interface Job {
  id: string
  title: string
  company: string
  location: string
  matchScore: number
  description: string
  requirements: string[]
  applyUrl: string
}

const mockJobs: Job[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    matchScore: 95,
    description:
      "We're looking for a Senior Frontend Developer to join our dynamic team. You'll be responsible for building modern web applications using React, TypeScript, and Next.js.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Next.js knowledge", "UI/UX design skills"],
    applyUrl: "https://example.com/apply/1",
  },
  {
    id: "2",
    title: "Full Stack Engineer",
    company: "StartupXYZ",
    location: "Remote",
    matchScore: 88,
    description:
      "Join our fast-growing startup as a Full Stack Engineer. Work with cutting-edge technologies and help shape the future of our platform.",
    requirements: ["React/Node.js experience", "Database design", "API development", "Agile methodology"],
    applyUrl: "https://example.com/apply/2",
  },
  {
    id: "3",
    title: "UI/UX Developer",
    company: "Design Studio",
    location: "New York, NY",
    matchScore: 82,
    description:
      "Creative UI/UX Developer needed to create beautiful, intuitive user interfaces. Perfect blend of design and development skills required.",
    requirements: ["Figma/Sketch proficiency", "CSS/SCSS expertise", "JavaScript knowledge", "Design systems"],
    applyUrl: "https://example.com/apply/3",
  },
]

export function ResumeMatchingApp() {
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [showJobModal, setShowJobModal] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!isSignedIn) {
      setShowSignUpModal(true)
      return
    }

    if (file.type !== "application/pdf") {
      toast.error("Invalid file type", {
        description: "Please upload a PDF file.",
      })
      return
    }

    setUploadedFile(file)
    const url = URL.createObjectURL(file)
    setPdfUrl(url)


    toast("Resume uploaded successfully!", {
      description: "We've found matching jobs for your profile.",
    })
  }

  const handleSignUp = () => {
    if (!email || !password) {
      toast.error("Missing information", {
  description: "Please fill in all fields.",
})
      return
    }

    setIsSignedIn(true)
    setShowSignUpModal(false)
    toast("Welcome!", {
  description: "You can now upload your resume to find matching jobs.",
})
  }

  const handleJobClick = (job: Job) => {
    setSelectedJob(job)
    setShowJobModal(true)
  }

  const getMatchColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 80) return "text-yellow-400"
    return "text-orange-400"
  }

  return (
    <div className="w-full h-screen flex flex-col rounded-2xl" style={{
        background: "radial-gradient(circle at center, #0c0e13ff, #000000)",
      }}>
      {/* Header Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
          ResumeMatch AI
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-6">
          Upload your resume and discover perfectly matched job opportunities powered by AI
        </p>
        {!isSignedIn && (
          <Button
            onClick={() => setShowSignUpModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-200"
          >
            Get Started
          </Button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6">
        {!uploadedFile ? (
          /* Upload Area */
          <div className="w-full flex items-center justify-center">
            <Card className="w-full max-w-md bg-gray-900/50 border-gray-700">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Upload Your Resume</h3>
                  <p className="text-gray-400 mb-6">Upload your PDF resume to find matching job opportunities</p>

                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-blue-500 transition-colors">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-300">Click to upload PDF</p>
                      <p className="text-sm text-gray-500 mt-1">Maximum file size: 10MB</p>
                    </div>
                  </label>
                  <input id="resume-upload" type="file" accept=".pdf" onChange={handleFileUpload} className="hidden" />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* PDF and Jobs Display */
          <>
             {/* PDF Viewer */}
            <div className="w-1/2">
              <Card className="h-full bg-gray-900/50 border-gray-700">
                <CardContent className="p-4 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Your Resume</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUploadedFile(null)
                        setPdfUrl(null)
                      }}
                      className="text-gray-400 border-gray-600"
                    >
                      Upload New
                    </Button>
                  </div>
                  <div className="h-full bg-white rounded-lg overflow-hidden">
                    {pdfUrl && <iframe src={pdfUrl} className="w-full h-full" title="Resume PDF" />}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Job Matches */}
            <div className="w-1/2">
              <Card className="h-full bg-gray-900/50 border-gray-700">
                <CardContent className="p-4 h-full">
                  <h3 className="text-lg font-semibold text-white mb-4">Matching Jobs</h3>
                  <div className="space-y-4 overflow-y-auto h-full">
                    {mockJobs.map((job) => (
                      <Card
                        key={job.id}
                        className="bg-gray-800/50 border-gray-600 cursor-pointer hover:bg-gray-800/70 transition-colors"
                        onClick={() => handleJobClick(job)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-white">{job.title}</h4>
                            <span className={`text-sm font-bold ${getMatchColor(job.matchScore)}`}>
                              {job.matchScore}% match
                            </span>
                          </div>
                          <p className="text-gray-300 text-sm mb-1">{job.company}</p>
                          <p className="text-gray-400 text-sm">{job.location}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Sign Up Modal */}
      <Dialog open={showSignUpModal} onOpenChange={setShowSignUpModal}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Sign Up Required</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please create an account to upload your resume and find matching jobs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Google Sign In Button */}
            <Button
              variant="outline"
              className="w-full bg-white hover:bg-gray-100 text-gray-900 border-gray-300 py-3"
              onClick={() => {
                // Mock Google sign in
                setIsSignedIn(true)
                setShowSignUpModal(false)
                toast("Welcome!", {
          description: "You can now upload your resume to find matching jobs.",
        })
              }}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-900 px-2 text-gray-400">Or continue with email</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white py-3"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white py-3"
                  />
                </div>
              </div>
              <Button onClick={handleSignUp} className="w-full bg-blue-600 hover:bg-blue-700 py-3">
                <User className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Job Details Modal */}
      <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">{selectedJob?.title}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedJob?.company} • {selectedJob?.location}
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Match Score:</span>
                <span className={`font-bold ${getMatchColor(selectedJob.matchScore)}`}>{selectedJob.matchScore}%</span>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Job Description</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{selectedJob.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Requirements</h4>
                <ul className="space-y-1">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => window.open(selectedJob.applyUrl, "_blank")}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Apply Now
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Small Footer */}
      <footer className="text-center py-4 border-t border-gray-800">
        <p className="text-sm text-gray-500">© 2024 ResumeMatch AI. Find your perfect job match.</p>
      </footer>
    </div>
  )
}
