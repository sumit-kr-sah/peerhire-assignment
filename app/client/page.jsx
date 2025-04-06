"use client"

import { useState, useEffect } from "react"
import { Star, Github, Linkedin, Globe, ArrowLeft, ChevronRight, User, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import RatingModal from "@/components/rating-modal"
import { ThemeToggle } from "@/components/theme-toggle"

export default function ClientPage() {
  // ======= STATE MANAGEMENT =======
  // Main data state
  const [freelancers, setFreelancers] = useState([]) // Stores all freelancer data fetched from API
  const [isLoading, setIsLoading] = useState(true)   // Track loading state during data fetching
  
  // UI/UX state
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false) // Controls rating modal visibility
  const [detailedView, setDetailedView] = useState(false)           // Toggle between list and detailed view
  
  // Selected data state
  const [selectedFreelancer, setSelectedFreelancer] = useState(null) // Currently selected freelancer
  const [selectedProject, setSelectedProject] = useState(null)       // Currently selected project
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("")     // Text search input value
  const [filterSkill, setFilterSkill] = useState("")   // Selected skill filter value

  // ======= DATA FETCHING =======
  // Fetch freelancers data from API when component mounts
  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/freelancers')
        if (!response.ok) {
          throw new Error('Failed to fetch freelancers')
        }
        const data = await response.json()
        setFreelancers(data)
      } catch (error) {
        console.error('Error fetching freelancers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFreelancers()
  }, [])

  // ======= HANDLE LOCAL STORAGE & RATINGS =======
  // Load saved ratings from localStorage and apply them to freelancers
  useEffect(() => {
    const savedRatings = localStorage.getItem("freelancerRatings")
    // Only process ratings if we have both ratings data and freelancers loaded
    if (savedRatings && freelancers.length > 0) {
      const ratingsData = JSON.parse(savedRatings)

      // Update freelancers with saved ratings
      const updatedFreelancers = freelancers.map((freelancer) => {
        const freelancerRatings = ratingsData.filter((rating) => rating.freelancerId === freelancer.id)

        if (freelancerRatings.length > 0) {
          // Calculate average rating from all ratings for this freelancer
          const totalRating = freelancerRatings.reduce((sum, rating) => sum + rating.rating, 0)
          const avgRating = totalRating / freelancerRatings.length

          // Move projects marked as completed from currentProjects to completedProjects
          const updatedCurrentProjects = []
          const updatedCompletedFromCurrent = []

          freelancer.currentProjects.forEach((project) => {
            const matchingRating = freelancerRatings.find((rating) => rating.projectId === project.id)
            if (matchingRating) {
              // Project has been rated - move to completed projects
              updatedCompletedFromCurrent.push({
                ...project,
                status: "completed",
                completionDate: matchingRating.date,
              })
            } else {
              // Project hasn't been rated - keep in current projects
              updatedCurrentProjects.push(project)
            }
          })

          // Return updated freelancer with new rating and reorganized projects
          return {
            ...freelancer,
            rating: avgRating,
            currentProjects: updatedCurrentProjects,
            completedProjects: [...freelancer.completedProjects, ...updatedCompletedFromCurrent],
            feedback: freelancerRatings.map((r) => r.feedback).filter(Boolean),
          }
        }

        return freelancer
      })

      setFreelancers(updatedFreelancers)
    }
  }, [freelancers.length]) // Dependency on freelancers.length ensures this runs after initial data fetch

  // ======= EVENT HANDLERS =======
  // Handle when a project status is changed (ongoing/completed)
  const handleStatusChange = (freelancerId, projectId, newStatus) => {
    // For status = "completed", move the project to completed and open rating modal
    if (newStatus === "completed") {
      moveProjectToCompleted(freelancerId, projectId)

      // Find the freelancer and project to display in rating modal
      const freelancer = freelancers.find((f) => f.id === freelancerId)
      const project =
        freelancer.currentProjects.find((p) => p.id === projectId) ||
        freelancer.completedProjects.find((p) => p.id === projectId)

      // Set selected data and open modal
      setSelectedFreelancer(freelancer)
      setSelectedProject(project)
      setIsRatingModalOpen(true)
    } else {
      // For other status changes, just update the status
      updateProjectStatus(freelancerId, projectId, newStatus)
    }
  }

  // Move a project from current to completed projects
  const moveProjectToCompleted = (freelancerId, projectId) => {
    const updatedFreelancers = freelancers.map((freelancer) => {
      if (freelancer.id === freelancerId) {
        // Find the project to move
        const projectToMove = freelancer.currentProjects.find((p) => p.id === projectId)

        if (!projectToMove) return freelancer // Project not found

        // Add completion date and update status
        const completedProject = {
          ...projectToMove,
          status: "completed",
          completionDate: new Date().toISOString(),
        }

        // Update freelancer data by removing project from current and adding to completed
        return {
          ...freelancer,
          currentProjects: freelancer.currentProjects.filter((p) => p.id !== projectId),
          completedProjects: [...freelancer.completedProjects, completedProject],
        }
      }
      return freelancer
    })

    setFreelancers(updatedFreelancers)
  }

  // Update project status without moving between current/completed
  const updateProjectStatus = (freelancerId, projectId, newStatus) => {
    const updatedFreelancers = freelancers.map((freelancer) => {
      if (freelancer.id === freelancerId) {
        // Check if the project is in current projects
        const currentProjectIndex = freelancer.currentProjects.findIndex((p) => p.id === projectId)

        if (currentProjectIndex !== -1) {
          // Update project in currentProjects array
          const updatedProjects = [...freelancer.currentProjects]
          updatedProjects[currentProjectIndex] = {
            ...updatedProjects[currentProjectIndex],
            status: newStatus,
          }

          return { ...freelancer, currentProjects: updatedProjects }
        }

        // Check if the project is in completed projects
        const completedProjectIndex = freelancer.completedProjects.findIndex((p) => p.id === projectId)

        if (completedProjectIndex !== -1) {
          // Update project in completedProjects array
          const updatedProjects = [...freelancer.completedProjects]
          updatedProjects[completedProjectIndex] = {
            ...updatedProjects[completedProjectIndex],
            status: newStatus,
          }

          return { ...freelancer, completedProjects: updatedProjects }
        }
      }
      return freelancer
    })

    setFreelancers(updatedFreelancers)
  }

  // Handle rating submission from modal
  const handleRatingSubmit = (rating, feedback) => {
    // Create rating data object
    const ratingData = {
      freelancerId: selectedFreelancer.id,
      projectId: selectedProject.id,
      rating,
      feedback,
      date: new Date().toISOString(),
    }

    // Save rating to localStorage
    const savedRatings = localStorage.getItem("freelancerRatings")
    const ratingsArray = savedRatings ? JSON.parse(savedRatings) : []
    ratingsArray.push(ratingData)
    localStorage.setItem("freelancerRatings", JSON.stringify(ratingsArray))

    // Calculate new average rating for the freelancer
    const freelancerRatings = ratingsArray.filter((r) => r.freelancerId === selectedFreelancer.id)
    const totalRating = freelancerRatings.reduce((sum, r) => sum + r.rating, 0)
    const avgRating = totalRating / freelancerRatings.length

    // Update freelancers state with new rating and feedback
    const updatedFreelancers = freelancers.map((freelancer) => {
      if (freelancer.id === selectedFreelancer.id) {
        return {
          ...freelancer,
          rating: avgRating,
          feedback: [...(freelancer.feedback || []), feedback].filter(Boolean),
        }
      }
      return freelancer
    })

    setFreelancers(updatedFreelancers)
    setIsRatingModalOpen(false)
  }

  // Render star rating component
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.div key={star} initial={{ scale: 1 }} whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
            <Star
              className={`h-4 w-4 ${star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300 dark:text-gray-600"}`}
            />
          </motion.div>
        ))}
      </div>
    )
  }

  // Handle switching to detailed view when a freelancer is clicked
  const handleFreelancerClick = (freelancer) => {
    setSelectedFreelancer(freelancer)
    setDetailedView(true)
  }

  // Handle going back to list view
  const handleBackToList = () => {
    setDetailedView(false)
    setSelectedFreelancer(null)
  }

  // ======= DATA PREPARATION =======
  // Get all unique skills from all freelancers for filtering
  const allSkills = [...new Set(freelancers.flatMap((f) => f.skills))].sort()

  // Filter freelancers based on search term and skill filter
  const filteredFreelancers = freelancers.filter((freelancer) => {
    const matchesSearch =
      searchTerm === "" ||
      freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSkill = filterSkill === "" || freelancer.skills.includes(filterSkill)

    return matchesSearch && matchesSkill
  })

  // ======= UI RENDERING =======
  // Render the list of freelancers
  const renderFreelancerList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-300">Loading freelancers...</span>
        </div>
      )
    }
    
    return (
      <>
        {/* Search and filter controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search freelancers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {/* Search icon */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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
          <div className="md:w-64">
            <select
              value={filterSkill}
              onChange={(e) => setFilterSkill(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
            >
              <option value="">All Skills</option>
              {allSkills.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Freelancer cards grid with animations */}
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredFreelancers.length > 0 ? (
              filteredFreelancers.map((freelancer, index) => (
                // Animated freelancer card with hover effects
                <motion.div
                  key={freelancer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden cursor-pointer transition-all"
                  onClick={() => handleFreelancerClick(freelancer)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mr-3">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 dark:text-white">{freelancer.name}</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-sm">
                            {freelancer.yearsExperience} years experience
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {freelancer.rating ? (
                          <div className="flex items-center bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                            <span className="text-sm font-medium mr-1 text-slate-700 dark:text-slate-200">
                              {freelancer.rating.toFixed(1)}
                            </span>
                            {renderStars(freelancer.rating)}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {freelancer.skills.slice(0, 3).map((skill, index) => (
                        <motion.span
                          key={index}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full"
                          whileHover={{ scale: 1.05 }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                      {freelancer.skills.length > 3 && (
                        <motion.span
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium rounded-full"
                          whileHover={{ scale: 1.05 }}
                        >
                          +{freelancer.skills.length - 3} more
                        </motion.span>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                      <div className="flex gap-2">
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                          <Clock className="h-3 w-3 mr-1" />
                          {freelancer.currentProjects.length}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {freelancer.completedProjects.length}
                        </span>
                      </div>
                      <motion.div
                        className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium"
                        whileHover={{ x: 3 }}
                      >
                        View Profile <ChevronRight className="h-4 w-4 ml-1" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // No results found message
              <motion.div className="col-span-full text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-slate-400 dark:text-slate-500 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300">No freelancers found</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </>
    )
  }

  // Render the detailed view of a selected freelancer
  const renderFreelancerDetail = () => {
    if (!selectedFreelancer) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden"
      >
        {/* Banner and profile header section */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-6">
            <div className="w-24 h-24 bg-white dark:bg-slate-700 p-1 rounded-xl shadow-md mb-4 md:mb-0">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                <User className="h-10 w-10" />
              </div>
            </div>
            <div className="md:ml-6 flex flex-col md:flex-row md:items-center md:justify-between w-full">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedFreelancer.name}</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {selectedFreelancer.yearsExperience} years experience
                </p>
              </div>
              <div className="mt-3 md:mt-0 flex items-center">
                {selectedFreelancer.rating ? (
                  <div className="flex items-center bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                    <div className="mr-2 font-medium text-slate-700 dark:text-slate-200">
                      {selectedFreelancer.rating.toFixed(1)}
                    </div>
                    {renderStars(selectedFreelancer.rating)}
                  </div>
                ) : (
                  <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                    Not rated yet
                  </span>
                )}
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <p className="text-slate-600 dark:text-slate-300 mb-6 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border-l-4 border-blue-500">
              {selectedFreelancer.description}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <motion.div
                className="mb-6 md:mb-0"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2">
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
                      <polygon points="14 2 18 6 7 17 3 17 3 13 14 2"></polygon>
                      <line x1="3" y1="22" x2="21" y2="22"></line>
                    </svg>
                  </span>
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFreelancer.skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm font-medium rounded-full"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 mr-2">
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
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    </svg>
                  </span>
                  Portfolio
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedFreelancer.portfolio.github && (
                    <motion.a
                      href={selectedFreelancer.portfolio.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex-grow sm:flex-grow-0"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span className="truncate">GitHub</span>
                    </motion.a>
                  )}
                  {selectedFreelancer.portfolio.linkedin && (
                    <motion.a
                      href={selectedFreelancer.portfolio.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex-grow sm:flex-grow-0"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Linkedin className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span className="truncate">LinkedIn</span>
                    </motion.a>
                  )}
                  {selectedFreelancer.portfolio.website && (
                    <motion.a
                      href={selectedFreelancer.portfolio.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors flex-grow sm:flex-grow-0"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Globe className="h-5 w-5 mr-2 flex-shrink-0" />
                      <span className="truncate">Website</span>
                    </motion.a>
                  )}
                </div>
              </motion.div>
            </div>

            {selectedFreelancer.currentProjects.length > 0 && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-2">
                    <Clock className="h-4 w-4" />
                  </span>
                  Ongoing Projects
                </h4>
                <div className="space-y-4">
                  {selectedFreelancer.currentProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      className="border border-slate-200 dark:border-slate-700 p-5 rounded-xl hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <h5 className="font-medium text-slate-800 dark:text-white text-lg mb-2">{project.name}</h5>
                      <p className="text-slate-600 dark:text-slate-300 mb-4">{project.description}</p>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <motion.span
                          className="px-3 py-1 text-sm font-medium rounded-full inline-flex items-center bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300"
                          whileHover={{ scale: 1.05 }}
                          layout
                        >
                          <span className="w-2 h-2 rounded-full mr-2 bg-blue-500"></span>
                          Ongoing
                        </motion.span>
                        <div className="relative">
                          <select
                            value="ongoing"
                            onChange={(e) => handleStatusChange(selectedFreelancer.id, project.id, e.target.value)}
                            className="appearance-none bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          >
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                            <svg
                              className="fill-current h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Completed Projects Section (including both original and newly completed) */}
            {selectedFreelancer.completedProjects.length > 0 && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mr-2">
                    <CheckCircle className="h-4 w-4" />
                  </span>
                  Completed Projects
                </h4>
                <div className="grid sm:grid-cols-2 gap-4">
                  {selectedFreelancer.completedProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ y: -5, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                    >
                      <h5 className="font-medium text-slate-800 dark:text-white">{project.name}</h5>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{project.description}</p>
                      <div className="flex items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        Completed: {new Date(project.completionDate).toLocaleDateString()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedFreelancer.feedback && selectedFreelancer.feedback.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center">
                  <span className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400 mr-2">
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
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </span>
                  Client Feedback
                </h4>
                <div className="space-y-3">
                  {selectedFreelancer.feedback.map((feedback, index) => (
                    <motion.div
                      key={index}
                      className="italic text-sm text-slate-600 dark:text-slate-300 border-l-2 border-yellow-300 pl-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-r-lg"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                    >
                      "{feedback}"
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    )
  }

  // ======= MAIN COMPONENT RENDER =======
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Theme toggle button */}
      <ThemeToggle />

      <div className="container mx-auto px-4 py-8">
        {/* Page header with back button */}
        <motion.div
          className="flex items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {detailedView ? (
            // Back button in detailed view
            <motion.button
              onClick={handleBackToList}
              className="flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white mr-4 bg-white dark:bg-slate-700 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </motion.button>
          ) : (
            // Back to home in list view
            <Link
              href="/"
              className="flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white mr-4 bg-white dark:bg-slate-700 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back
            </Link>
          )}
          {/* Page title with dynamic text */}
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {detailedView ? "Freelancer Profile" : "Client Dashboard"}
          </h1>
        </motion.div>

        <div className="mb-8">
          {/* Heading for list view */}
          {!detailedView && (
            <motion.h2
              className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Available Freelancers
            </motion.h2>
          )}

          {/* Toggle between detailed and list view with animation */}
          <AnimatePresence mode="wait">
            {detailedView ? renderFreelancerDetail() : renderFreelancerList()}
          </AnimatePresence>
        </div>
      </div>

      {/* Rating modal - only shown when isRatingModalOpen is true */}
      <AnimatePresence>
        {isRatingModalOpen && selectedFreelancer && selectedProject && (
          <RatingModal
            freelancer={selectedFreelancer}
            project={selectedProject}
            onClose={() => setIsRatingModalOpen(false)}
            onSubmit={handleRatingSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

