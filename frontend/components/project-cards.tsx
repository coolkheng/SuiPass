"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { GitBranch, Users, Plus, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

// Mock data for projects
const mockProjects = [
  {
    id: "1",
    name: "Backend API",
    description: "Main backend API service with authentication and core services",
    environments: 3,
    members: 5,
    status: "active" as const,
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    name: "Web Dashboard",
    description: "Frontend application for user and admin interfaces",
    environments: 3,
    members: 4,
    status: "active" as const,
    updatedAt: "3 days ago",
  },
  {
    id: "3",
    name: "Mobile App",
    description: "React Native mobile application for iOS and Android",
    environments: 2,
    members: 3,
    status: "inactive" as const,
    updatedAt: "1 week ago",
  }
]

export function ProjectCards() {
  const [projects, setProjects] = useState(mockProjects)
  
  // Fetch projects from API (simulate with timeout)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Here you would fetch from API
        // const response = await fetch('/api/projects')
        // const data = await response.json()
        // setProjects(data)
        
        // Just using mock data for now
        setProjects(mockProjects)
      } catch (error) {
        console.error("Error fetching projects:", error)
      }
    }
    
    fetchProjects()
  }, [])
  
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          className="spotlight-card group bg-blue-50/50 dark:bg-blue-950/20 backdrop-blur-sm border border-blue-200/60 dark:border-blue-700/30 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:border-blue-300/80 dark:hover:border-blue-600/50 cursor-pointer relative shadow-sm hover:shadow-lg"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
            e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
          }}
        >
          <div className="p-6">
            <div className="flex items-start justify-between pb-2">
              <div>
                <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-blue-400">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="hover:underline"
                  >
                    {project.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="-mt-1 -mr-2 hover:bg-white/10"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>Edit project</DropdownMenuItem>
                  <DropdownMenuItem>Clone project</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Delete project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="py-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  <span>{project.environments} environments</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{project.members} members</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t border-white/10 pt-3">
              <div className="text-xs text-muted-foreground">
                Updated {project.updatedAt}
              </div>
              <Badge
                variant={
                  project.status === "active" ? "default" : "secondary"
                }
                className="bg-white/10 border-white/20"
              >
                {project.status === "active" ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>
      ))}
      <Link href="/dashboard/projects/new" className="block">
        <div 
          className="spotlight-card group bg-blue-50/50 dark:bg-blue-950/20 backdrop-blur-sm border border-blue-200/60 dark:border-blue-700/30 border-dashed rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:border-blue-300/80 dark:hover:border-blue-600/50 cursor-pointer relative overflow-hidden flex h-full flex-col items-center justify-center shadow-sm hover:shadow-lg"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
            e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
          }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/50">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <h3 className="mt-4 font-medium group-hover:text-blue-400 transition-colors duration-300">Create New Project</h3>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Set up a new project to manage your secrets
          </p>
        </div>
      </Link>
    </div>
  )
} 