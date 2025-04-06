"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Clock, DollarSign, Calendar, Briefcase, Tag, ChevronRight, Plus } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import BidModal from "@/components/bid-modal"
import { ThemeToggle } from "@/components/theme-toggle"

export default function FreelancerPage() {
  // ======= STATE MANAGEMENT =======
  // Main data state
  const [projects, setProjects] = useState([])    // Stores all project data fetched from API
  const [bids, setBids] = useState([])            // Stores freelancer's bids on projects
  const [isLoading, setIsLoading] = useState(true) // Track loading state during data fetching
  
  // UI/UX state
  const [isBidModalOpen, setIsBidModalOpen] = useState(false) // Controls bid modal visibility
  const [selectedProject, setSelectedProject] = useState(null) // Currently selected project for bidding
  
  // Filter and sort state
  const [filterSkill, setFilterSkill] = useState("")   // Selected skill filter value
  const [searchTerm, setSearchTerm] = useState("")     // Text search input value
  const [sortBy, setSortBy] = useState("default")      // Current sort method for projects

  // ======= DATA FETCHING =======
  useEffect(() => {
    // Fetch projects data from API
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/projects')
        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Load saved bids from localStorage
    const loadBids = () => {
      const savedBids = localStorage.getItem("freelancerBids")
      if (savedBids) {
        setBids(JSON.parse(savedBids))
      }
    }

    // Execute both operations when component mounts
    fetchProjects()
    loadBids()
  }, [])

  // ======= EVENT HANDLERS =======
  // Open the bid modal when a project is clicked
  const handleBidClick = (project) => {
    setSelectedProject(project)
    setIsBidModalOpen(true)
  }

  // Handle bid submission from modal
  const handleBidSubmit = (bidData) => {
    // Create a new bid object with current timestamp as ID
    const newBid = {
      id: Date.now().toString(),
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      amount: bidData.amount,
      timeline: bidData.timeline,
      proposal: bidData.proposal,
      status: "pending", // Initial status is always pending
      date: new Date().toISOString(),
    }

    // Add the new bid to existing bids
    const updatedBids = [...bids, newBid]
    setBids(updatedBids)

    // Save updated bids to localStorage for persistence
    localStorage.setItem("freelancerBids", JSON.stringify(updatedBids))

    // Close the modal after submission
    setIsBidModalOpen(false)
  }

  // Check if the user has already bid on a specific project
  const hasBidOnProject = (projectId) => {
    return bids.some((bid) => bid.projectId === projectId)
  }

  // ======= DATA PREPARATION =======
  // Get all unique skills from all projects for filtering
  const allSkills = [...new Set(projects.flatMap((p) => p.requiredSkills))].sort()

  // Filter and sort projects based on user selection
  const filteredProjects = projects
    // First apply filters (search term and skill)
    .filter((project) => {
      // Match by name or description text
      const matchesSearch =
        searchTerm === "" ||
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())

      // Match by required skill
      const matchesSkill = filterSkill === "" || project.requiredSkills.includes(filterSkill)

      return matchesSearch && matchesSkill
    })
    // Then apply sorting based on selected sort method
    .sort((a, b) => {
      if (sortBy === "budget-high") return b.budget - a.budget             // Highest budget first
      if (sortBy === "budget-low") return a.budget - b.budget               // Lowest budget first
      if (sortBy === "timeline-short") return a.timeline - b.timeline       // Shortest timeline first
      if (sortBy === "timeline-long") return b.timeline - a.timeline        // Longest timeline first
      return 0 // default, no sorting
    })

  // Get color class for bid status badges
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
      case "accepted":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
      case "rejected":
        return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
      default:
        return "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
    }
  }

  // ======= MAIN COMPONENT RENDER =======
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Theme Toggle - persistent UI element */}
      <ThemeToggle />

      <div className="container mx-auto px-4 py-8">
        {/* Page header with back button */}
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/"
            className="flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white mr-4 bg-white dark:bg-slate-700 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Freelancer Dashboard
          </h1>
        </motion.div>

        {/* Two-column layout on larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects section - takes 2/3 of the width on large screens */}
          <motion.div
            className="lg:col-span-2 mb-8 lg:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header with filters and sort controls */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
              <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4 lg:mb-0">
                Available Projects
              </h2>

              {/* Filter and sort controls */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {/* Search input */}
                <div className="relative flex-grow sm:max-w-xs">
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  {/* Search icon */}
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                </div>

                {/* Skills filter dropdown */}
                <select
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                >
                  <option value="">All Skills</option>
                  {allSkills.map((skill) => (
                    <option key={skill} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>

                {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                >
                  <option value="default">Sort By</option>
                  <option value="budget-high">Budget: High to Low</option>
                  <option value="budget-low">Budget: Low to High</option>
                  <option value="timeline-short">Timeline: Shortest</option>
                  <option value="timeline-long">Timeline: Longest</option>
                </select>
              </div>
            </div>

            {/* Projects list with animations */}
            <AnimatePresence>
              <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {isLoading ? (
                  // Loading state indicator
                  <motion.div className="flex justify-center items-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-slate-600 dark:text-slate-300">Loading projects...</span>
                  </motion.div>
                ) : filteredProjects.length > 0 ? (
                  // Map through filtered projects when there are results
                  filteredProjects.map((project, index) => (
                    // Animated project card with hover effects
                    <motion.div
                      key={project.id}
                      className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{
                        y: -5,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                    >
                      {/* Project card content */}
                      <div className="p-6">
                        {/* Project header with name and timeline */}
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{project.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {project.timeline} days
                            </span>
                          </div>
                        </div>

                        {/* Project description */}
                        <p className="text-slate-600 dark:text-slate-300 mb-4">{project.description}</p>

                        {/* Project details - budget and timeline */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center">
                              <DollarSign className="h-4 w-4 mr-1 text-green-500 dark:text-green-400" />
                              Budget
                            </h4>
                            <p className="text-lg font-semibold text-slate-800 dark:text-white">
                              ₹{project.budget.toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                            <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-blue-500 dark:text-blue-400" />
                              Timeline
                            </h4>
                            <p className="text-lg font-semibold text-slate-800 dark:text-white">
                              {project.timeline} days
                            </p>
                          </div>
                        </div>

                        {/* Required skills section */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 flex items-center">
                            <Tag className="h-4 w-4 mr-1 text-purple-500 dark:text-purple-400" />
                            Required Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {project.requiredSkills.map((skill, index) => (
                              <motion.span
                                key={index}
                                className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-medium rounded-full"
                                whileHover={{ scale: 1.05 }}
                              >
                                {skill}
                              </motion.span>
                            ))}
                          </div>
                        </div>

                        {/* Bid button - disabled if already bid on this project */}
                        <motion.button
                          onClick={() => handleBidClick(project)}
                          disabled={hasBidOnProject(project.id)}
                          className={`w-full py-2 px-4 rounded-lg font-medium flex items-center justify-center ${
                            hasBidOnProject(project.id)
                              ? "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                              : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 transition-colors"
                          }`}
                          whileHover={!hasBidOnProject(project.id) ? { scale: 1.02 } : {}}
                          whileTap={!hasBidOnProject(project.id) ? { scale: 0.98 } : {}}
                        >
                          {hasBidOnProject(project.id) ? (
                            "Bid Placed"
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-1" />
                              Place a Bid
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  // No results found message
                  <motion.div
                    className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-slate-400 dark:text-slate-500 mb-3">
                      <Briefcase className="h-12 w-12 mx-auto" />
                    </div>
                    <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300">No projects found</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                      Try adjusting your search or filter criteria
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Bids section - takes 1/3 of the width on large screens */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Your Bids</h2>
            {bids.length > 0 ? (
              // Show list of bids when there are any
              <div className="space-y-4">
                <AnimatePresence>
                  {bids.map((bid, index) => (
                    // Individual bid card with animations
                    <motion.div
                      key={bid.id}
                      className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                      whileHover={{ y: -3, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                    >
                      {/* Bid card content */}
                      <div className="p-4">
                        {/* Bid header with project name and status */}
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-slate-800 dark:text-white">{bid.projectName}</h3>
                          <motion.span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(bid.status)}`}
                            whileHover={{ scale: 1.05 }}
                            layout
                          >
                            {/* Capitalize first letter of status */}
                            {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                          </motion.span>
                        </div>

                        {/* Bid details - amount and timeline */}
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                            <span className="text-slate-500 dark:text-slate-400">Your Bid:</span>
                            <span className="ml-1 font-medium text-slate-700 dark:text-slate-200">
                              ₹{bid.amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                            <span className="text-slate-500 dark:text-slate-400">Timeline:</span>
                            <span className="ml-1 font-medium text-slate-700 dark:text-slate-200">
                              {bid.timeline} days
                            </span>
                          </div>
                        </div>

                        {/* Bid proposal with truncation if too long */}
                        <div className="mt-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-slate-500 dark:text-slate-400 text-sm">Proposal:</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(bid.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 text-sm bg-slate-50 dark:bg-slate-700/50 p-2 rounded-lg">
                            {bid.proposal.length > 100 ? `${bid.proposal.substring(0, 100)}...` : bid.proposal}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              // Show empty state when no bids exist
              <motion.div
                className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">You haven't placed any bids yet.</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
                  Browse available projects and submit proposals to start your freelancing journey.
                </p>
                <motion.div
                  className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center justify-center cursor-pointer"
                  whileHover={{ x: 3 }}
                >
                  Explore Projects <ChevronRight className="h-4 w-4 ml-1" />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bid modal - only shown when isBidModalOpen is true */}
      <AnimatePresence>
        {isBidModalOpen && selectedProject && (
          <BidModal project={selectedProject} onClose={() => setIsBidModalOpen(false)} onSubmit={handleBidSubmit} />
        )}
      </AnimatePresence>
    </div>
  )
}

