/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-wrapper-object-types */



"use client"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Globe,
    Plus,
    MapPin,
    Building2,
    Star,
    Award,

} from "lucide-react"
import { redirect } from "next/navigation";


interface Job {
    id: string
    title: string
    company: string
    location: string
    description: string
    url: string
    category?: string
    created: string
    matchscore: number
}

export default function SkillsJobDashboard() {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [count, setcount] = useState(0);
    const [skills, setskills] = useState([]);
    const [keyloading, setkeyloading] = useState(false);
    const [allJobs, setAllJobs] = useState<any[]>([]);
    const pageSize = 10; 




    useEffect(() => {
        const fetchkey = async () => {
            setkeyloading(true)
            try {
                const res = await fetch(`/api/getkeywords`)
                const data = await res.json();
                setskills(data.keywords);
            } catch (err) {
                console.error("Error fetching jobs:", err)
            } finally {
                setkeyloading(false);
            }
        }
        fetchkey()
    }, [page])

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/jobs"); 
                const data = await res.json();
                setcount(data.count);
                setAllJobs(data.jobs);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        setJobs(allJobs.slice(start, end));
    }, [page, allJobs]);


    const totalPages = Math.ceil(allJobs.length / pageSize);

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    return (
        <div className="min-h-screen lg:h-screen flex flex-col p-4 max-w-7xl mx-auto ">
            <div className="mb-4 flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-2 lg:space-y-0">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-foreground mb-1">Skills & Job Recommendations</h1>
                    <p className="text-sm text-muted-foreground">
                        Personalized job matches based on your skills
                    </p>
                </div>
                <div >
                    <Button onClick={() => {
                        redirect("/");
                    }} className="rounded-2xl "><Plus></Plus>Upload New Resume</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0 ">
                {/* Left Side - Skills Section */}
                <div className="flex flex-col gap-4 min-h-0 overflow-hidden">
                    <Card className="flex-1 min-h-0 flex flex-col  rounded-2xl ">
                        <CardHeader className="flex-shrink-0 pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Award className="h-4 w-4 text-primary" />
                                Your Skills :

                                {!keyloading ? (
                                    <h3>{skills.length} Total Skills Found</h3>
                                ) : (
                                    <h3>Finding Your Skills...</h3>
                                )}
                            </CardTitle>
                            <CardDescription className="text-sm">
                                Skills extracted from your profile and experience
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto min-h-0 dark-scrollbar">
                            <div className="space-y-3">
                                {!keyloading ? (skills.map((skill, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-2 rounded-2xl hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="p-1.5 rounded-2xl bg-primary/10 flex-shrink-0">
                                                <Globe className="h-5 w-5 text-primary rounded-2xl" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-medium text-sm text-foreground">{skill}</h4>
                                            </div>
                                        </div>
                                    )
                                })) : (
                                    <div className="flex flex-col space-y-4">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="flex items-center space-x-4">
                                                <Skeleton className="h-16 w-16 rounded-full" />
                                                <div className="space-y-2 w-full">
                                                    {/* full width on mobile, shrink on bigger screens */}
                                                    <Skeleton className="h-4 w-3/4 sm:w-[400px]" />
                                                    <Skeleton className="h-4 w-1/2 sm:w-[300px]" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                )}
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Right Side - Job Recommendations */}
                <div className="flex flex-col min-h-0">
                    <Card className="flex-1 h-full min-h-0 flex flex-col rounded-2xl dark-scrollbar">
                        <CardHeader className="flex-shrink-0 pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Building2 className="h-4 w-4 text-primary" />
                                Recommended Jobs
                            </CardTitle>
                            <CardDescription className="text-sm">
                                {loading ? (
                                    <div>
                                        Finding Jobs based on extracted skills
                                    </div>
                                ) : (
                                    <div>
                                        Found {count} Jobs based on extracted skills
                                    </div>
                                )}

                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex-col space-y-3 overflow-y-auto min-h-0 flex flex-col dark-scrollbar">
                            <div className="flex flex-col space-y-3">
                                {loading ? (
                                    <div className="flex flex-col space-y-4">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="flex items-center space-x-4">
                                                <Skeleton className="h-16 w-16 rounded-full" />
                                                <div className="space-y-2 w-full">
                                                    {/* full width on mobile, shrink on bigger screens */}
                                                    <Skeleton className="h-4 w-3/4 sm:w-[400px]" />
                                                    <Skeleton className="h-4 w-1/2 sm:w-[300px]" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                ) : jobs.length == 0 && !loading ? (
                                    <div className="h-full justify-center items-center">

                                        <p className="text-center text-muted-foreground">No jobs found.</p>
                                    </div>
                                ) : (
                                    jobs.map((job) => (
                                        <Card
                                            key={job.id}
                                            className="hover:shadow-md transition-shadow rounded-2xl dark-scrollbar "
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="flex-1 space-y-2 min-w-0">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="min-w-0">
                                                                <h3 className="font-semibold text-base text-foreground truncate">
                                                                    {job.title}
                                                                </h3>
                                                                <p className="text-sm text-muted-foreground truncate">
                                                                    {job.company}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-1 bg-white/95 text-black px-2 py-1 rounded-2xl flex-shrink-0">
                                                                <Star className="h-3 w-3 text-accent fill-current" />
                                                                <span className="text-xs font-medium text-accent">
                                                                    {job.matchscore}%
                                                                </span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                            <div className="flex items-center gap-1 rounded-2xl">
                                                                <MapPin className="h-3 w-3" />
                                                                <span className="truncate">{job.location}</span>
                                                            </div>
                                                        </div>

                                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                                            {job.description}
                                                        </p>

                                                        <div className="my-2"></div>

                                                        <div className="flex items-center justify-between pt-1 rounded-2xl">
                                                            <Button
                                                                size="sm"
                                                                className="bg-primary hover:bg-primary/90 text-xs rounded-2xl"
                                                                onClick={() => window.open(job.url, "_blank")}
                                                            >
                                                                Apply Now
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>

                            {/* Pagination controls */}
                            <div className="flex justify-between items-center mt-6">
                                <Button className="rounded-4xl" onClick={handlePrev} disabled={page === 1}>Prev</Button>
                                <span className="text-xs">Page {page} of {totalPages}</span>
                                <Button className="rounded-4xl" onClick={handleNext} disabled={page === totalPages}>Next</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
