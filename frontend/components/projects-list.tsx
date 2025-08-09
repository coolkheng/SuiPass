"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Grid3X3,
  List,
  MoreHorizontal,
  GitBranch,
  Users,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Projects = {
  id: string;
  name: string;
  description: string;
  environments: number;
  members: number;
  status: "active" | "inactive";
  updatedAt: string;
};

export function ProjectsList() {
  const [projects, setProjects] = useState<Projects[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample project data
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : data.projects || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]); // Set to empty array on error
      }
    }

    fetchProjects();
  }, []);

  // Filter projects based on search query
  const filteredProjects = Array.isArray(projects) ? projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search projects..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Tabs defaultValue="all" className="w-[300px]">
            <TabsList 
              className="spotlight-card bg-blue-50/50 dark:bg-blue-950/20 backdrop-blur-sm border border-blue-200/60 dark:border-blue-700/30"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
              }}
            >
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-r-none ${
                viewMode === "grid" ? "bg-muted" : ""
              }`}
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-l-none ${
                viewMode === "list" ? "bg-muted" : ""
              }`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
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
                    className="spotlight-card bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-700/30"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                      e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                    }}
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
      ) : (
        <div className="spotlight-card bg-blue-50/50 dark:bg-blue-950/20 backdrop-blur-sm border border-blue-200/60 dark:border-blue-700/30 rounded-2xl overflow-hidden shadow-sm"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
            e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
          }}
        >
          <div className="grid grid-cols-12 gap-4 p-4 font-medium text-muted-foreground border-b border-white/10">
            <div className="col-span-5">Project</div>
            <div className="col-span-2">Environments</div>
            <div className="col-span-2">Members</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1"></div>
          </div>
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`grid grid-cols-12 gap-4 p-4 group hover:bg-white/5 transition-colors duration-300 ${
                index !== filteredProjects.length - 1 ? "border-b border-white/10" : ""
              }`}
            >
              <div className="col-span-5">
                <div className="font-medium group-hover:text-blue-400 transition-colors duration-300">
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className="hover:underline"
                  >
                    {project.name}
                  </Link>
                </div>
                <div className="text-sm text-muted-foreground">
                  {project.description}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Updated {project.updatedAt}
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <div className="flex items-center gap-1">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  <span>{project.environments}</span>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{project.members}</span>
                </div>
              </div>
              <div className="col-span-2 flex items-center">
                <Badge
                  variant={
                    project.status === "active" ? "default" : "secondary"
                  }
                  className="spotlight-card bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-700/30"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                    e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                  }}
                >
                  {project.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hover:bg-white/10">
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
            </div>
          ))}
          <Link
            href="/dashboard/projects/new"
            className="block border-t border-white/10 p-4 text-center hover:bg-white/5 transition-colors duration-300 group"
          >
            <Button variant="outline" className="btn-blue-gradient group-hover:text-white transition-colors duration-300">
              <Plus className="mr-2 h-4 w-4" />
              Create New Project
            </Button>
          </Link>
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? `No projects matching "${searchQuery}"`
                : "Get started by creating your first project"}
            </p>
            {!searchQuery && (
              <Button className="btn-blue-gradient mt-4" asChild>
                <Link href="/dashboard/projects/new">Create Project</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
