"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Home,
  FolderKanban,
  Users,
  Activity,
  CreditCard,
  Settings,
  HelpCircle,
  LifeBuoy,
  GitPullRequest,
  Bot,
  Shield,
  ChevronRight,
  ChevronLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface DashboardSidebarProps {
  onExpandChange?: (expanded: boolean) => void
  onHoverChange?: (hovered: boolean) => void
}

export function DashboardSidebar({ onExpandChange, onHoverChange }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const shouldShowExpanded = isExpanded || isHovered

  const handleExpandToggle = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    onExpandChange?.(newExpanded)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    onHoverChange?.(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    onHoverChange?.(false)
  }

  const routes = [
    {
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Personal",
      icon: <Shield className="h-5 w-5" />,
      href: "/dashboard/personal",
      active: pathname === "/dashboard/personal" || pathname.startsWith("/dashboard/personal/"),
    },
    {
      label: "Projects",
      icon: <FolderKanban className="h-5 w-5" />,
      href: "/dashboard/projects",
      active: pathname === "/dashboard/projects" || pathname.startsWith("/dashboard/projects/"),
    },
    {
      label: "Team",
      icon: <Users className="h-5 w-5" />,
      href: "/dashboard/team",
      active: pathname === "/dashboard/team",
    },
    {
      label: "Activity",
      icon: <Activity className="h-5 w-5" />,
      href: "/dashboard/activity",
      active: pathname === "/dashboard/activity",
    },
    {
      label: "Change Requests",
      icon: <GitPullRequest className="h-5 w-5" />,
      href: "/dashboard/change-requests",
      active: pathname === "/dashboard/change-requests",
    },
    {
      label: "Billing",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/dashboard/billing",
      active: pathname === "/dashboard/billing",
    },
    {
      label: "AI Assistant",
      icon: <Bot className="h-5 w-5" />,
      href: "/dashboard/assistant",
      active: pathname === "/dashboard/assistant",
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/dashboard/settings",
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <motion.div 
      className="fixed top-0 left-0 h-screen flex flex-col border-r border-white/20 bg-gradient-to-b from-[#11315B] via-[#2F71A7] to-[#52B6F8] text-white shadow-2xl z-50"
      animate={{ width: shouldShowExpanded ? 256 : 64 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          className="spotlight-card bg-white/10 hover:bg-white/20 hover:border-white/20 rounded-lg transition-all duration-300"
          onClick={handleExpandToggle}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
            e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
          }}
        >
          {shouldShowExpanded ? (
            <ChevronLeft className="h-4 w-4 text-white" />
          ) : (
            <ChevronRight className="h-4 w-4 text-white" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-hidden py-4">
        <nav className="grid gap-1 px-2">
          {routes.map((route, index) => (
            <motion.div
              key={route.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className={cn(
                  "spotlight-card group relative rounded-lg transition-all duration-300 hover:scale-105",
                  route.active
                    ? "bg-white/20 hover:border-white/30"
                    : "hover:bg-white/10 hover:border-white/20"
                )}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                  e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
                }}
              >
                <Link href={route.href} className="flex items-center p-3">
                  <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                    {route.icon}
                  </div>
                  <motion.span 
                    className={cn(
                      "ml-3 text-sm font-medium transition-colors duration-300",
                      route.active 
                        ? "text-white" 
                        : "text-white/80 group-hover:text-blue-200"
                    )}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ 
                      opacity: shouldShowExpanded ? 1 : 0,
                      width: shouldShowExpanded ? "auto" : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {route.label}
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          ))}
        </nav>

        {/* Help Section */}
        <motion.div 
          className="mt-6 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: shouldShowExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {shouldShowExpanded && (
            <motion.div
              className="spotlight-card rounded-lg bg-white/10 p-4 group hover:bg-white/15 hover:border-white/20 transition-all duration-300"
              whileHover={{ y: -2, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
                e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
              }}
            >
              <div className="mb-2 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-200" />
                <h4 className="font-medium text-white group-hover:text-blue-200 transition-colors duration-300">Need help?</h4>
              </div>
              <p className="mb-3 text-sm text-white/70">
                Check our documentation or contact support for assistance.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-blue-200 transition-all duration-300" 
                asChild
              >
                <Link href="#">
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  Support
                </Link>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
