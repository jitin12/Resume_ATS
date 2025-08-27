"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent,  DialogTitle  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, User} from "lucide-react"
import { toast } from "sonner";
import { signIn, signOut, useSession } from "next-auth/react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import axios from 'axios'
import { Progress } from "@/components/ui/progress"
import { redirect } from "next/navigation";




export default function Resume() {


  const { data: session } = useSession();
  const [progress, setProgress] = useState(13)

  const [showSignUpModal, setShowSignUpModal] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)



  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!session) {
      setShowSignUpModal(true)
      return
    }

    if (file.type !== "application/pdf") {
      toast.error("Invalid file type", {
        description: "Please upload a PDF file.",
      })
      return
    }
    if (file.size > (1024 * 1024 * 10)) {
      toast.error("File too big", {
        description: "Please upload a smaller file.",
      })
      return
    }
    else {
      toast("Uploading Resume", {
          description: "We're finding relevant jobs for you.",
        })
      setTimeout(() => {
        setProgress(45)
      }, 500);
      setTimeout(() => {
        setProgress(60)
      }, 1200);
      setTimeout(() => {
        setProgress(90)
      }, 2000);
      setUploadedFile(file);
      const email = session?.user?.email;
      if (!email) throw new Error("User not logged in");

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("email", email);

      await axios.post("/api/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(() => {
        setProgress(100)
        
        toast("Resume uploaded successfully!", {
          description: "We've found matching jobs for your profile.",
        })
        redirect("/jobs");
      });

    }
  }



  return (



  
  
    <div className=" min-h-screen m-0 flex flex-col items-center justify-center"  style={{
      background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #1a1d23ff 100%)",
    }}>

      <nav className="bg-gray-900/20 w-full backdrop-blur-md border-b border-gray-800/30 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h2 className="text-xl font-bold text-white ">Parsley.io</h2>

          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-black" />
                </div>
                <span className="text-gray-300 hidden sm:inline">Welcome : {session?.user?.name}</span>
                <Button
                  onClick={() => signOut()}
                  className="bg-white text-black border-gray-600 px-4 py-2 hover:px-6 rounded-4xl "
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowSignUpModal(true)}
                className="bg-white text-black px-4 py-2 rounded-4xl hover:px-6"
              >
                Sign In
              </Button>
            )}


          </div>
        </div>
      </nav>
      {uploadedFile  && (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-black/20 z-50">
                          <h3 className="text-xl font-semibold text-white mb-2">Uploading...</h3>

          <Progress value={progress} className="w-[60%]" />        </div>
      )}

      

        <div className="text-center py-3">
          <h1 className="font-serif text-3xl md:text-6xl lg:text-8xl text-white font-bold [text-shadow:0_0_4px_white] lg:mb-4 mb-2">
            Parsley.io
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-6">
            Upload your resume and discover perfectly matched job opportunities powered by AI
          </p>
          {!session && (
            <Button
              onClick={() => setShowSignUpModal(true)}

              size="lg"
              className="bg-slate-100 shadow-[0_0_5px_white] text-black text-md rounded-4xl font-semibold  hover:scale-105 transition-all duration-200"
            >
              Get Started
            </Button>
          )}
        </div>
      


      {/* Upload Area */}
      <div className="w-full flex items-center justify-center ">
        {!uploadedFile && (

          <Card className="w-full max-w-7xl bg-gray-900/50 border-gray-700 rounded-2xl lg:mx-0 mx-10  ">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12  bg-blue-600/20 rounded-full flex items-center justify-center mb-4 ">
                  <Upload className="w-8 h-8 text-blue-300" />
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
        )}
      </div>

      <footer className="text-center py-2 border-t border-gray-900 mt-auto ">
        <p className="text-sm text-gray-500">© 2025 Parsley.io Find your perfect job match.</p>
      </footer>


      <Dialog open={showSignUpModal} onOpenChange={setShowSignUpModal}>
        <DialogContent className="rounded-4xl ">
          <DialogTitle className="sr-only m-0">Sign up</DialogTitle>

          <Card className="rounded-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Login with your Google account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid gap-6">
                  <div className="flex flex-col gap-4">

                    <Button variant="outline" type="button" className="w-full rounded-2xl" onClick={() => signIn("google")}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      Login with Google
                    </Button>
                  </div>
                  <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                      Or continue with
                    </span>
                  </div>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        className="rounded-2xl"
                        id="email"
                        type="email"
                        placeholder="Please Login using Google"
                        disabled
                      />
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <a
                          href="#"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Forgot your password?
                        </a>
                      </div>
                      <Input id="password" className="rounded-2xl" type="password" disabled />
                    </div>
                    <Button type="submit" disabled className="w-full rounded-2xl">
                      Login
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <a href="#" className="underline underline-offset-4">
                      Sign up
                    </a>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  )
}

