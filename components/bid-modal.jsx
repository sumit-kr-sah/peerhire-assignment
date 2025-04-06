"use client"

import { useState } from "react"
import { X, DollarSign, Calendar, FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function BidModal({ project, onClose, onSubmit }) {
  const [amount, setAmount] = useState(project.budget)
  const [timeline, setTimeline] = useState(project.timeline)
  const [proposal, setProposal] = useState("")
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors = {}

    if (!amount || amount <= 0) {
      newErrors.amount = "Please enter a valid bid amount"
    }

    if (!timeline || timeline <= 0) {
      newErrors.timeline = "Please enter a valid timeline"
    }

    if (!proposal.trim()) {
      newErrors.proposal = "Please enter a proposal message"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validate()) {
      setIsSubmitting(true)

      // Simulate a small delay for better UX
      setTimeout(() => {
        onSubmit({
          amount: Number(amount),
          timeline: Number(timeline),
          proposal,
        })
        setIsSubmitting(false)
      }, 600)
    }
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-xl shadow-lg max-w-md w-full"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Place a Bid</h2>
            <motion.button
              onClick={onClose}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full p-2 transition-colors"
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-6">
              <p className="text-slate-600 dark:text-slate-300 mb-2">You're bidding on the project:</p>
              <p className="font-medium text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                {project.name}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg flex items-start">
                  <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Client's Budget</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      ₹{project.budget.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg flex items-start">
                  <Calendar className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">Expected Timeline</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">{project.timeline} days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="amount"
                className="block text-slate-700 dark:text-slate-200 font-medium mb-2 flex items-center"
              >
                <DollarSign className="h-4 w-4 mr-1 text-slate-500 dark:text-slate-400" />
                Your Bid Amount (₹)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full border ${
                  errors.amount ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                } rounded-lg p-3 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                placeholder="Enter your bid amount"
              />
              {errors.amount && (
                <motion.p
                  className="text-red-500 dark:text-red-400 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.amount}
                </motion.p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="timeline"
                className="block text-slate-700 dark:text-slate-200 font-medium mb-2 flex items-center"
              >
                <Calendar className="h-4 w-4 mr-1 text-slate-500 dark:text-slate-400" />
                Proposed Timeline (days)
              </label>
              <input
                type="number"
                id="timeline"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className={`w-full border ${
                  errors.timeline ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                } rounded-lg p-3 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                placeholder="Enter your proposed timeline"
              />
              {errors.timeline && (
                <motion.p
                  className="text-red-500 dark:text-red-400 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.timeline}
                </motion.p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="proposal"
                className="block text-slate-700 dark:text-slate-200 font-medium mb-2 flex items-center"
              >
                <FileText className="h-4 w-4 mr-1 text-slate-500 dark:text-slate-400" />
                Proposal Message
              </label>
              <textarea
                id="proposal"
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                className={`w-full border ${
                  errors.proposal ? "border-red-500" : "border-slate-300 dark:border-slate-600"
                } rounded-lg p-3 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
                rows={4}
                placeholder="Explain why you're the best fit for this project..."
              />
              {errors.proposal && (
                <motion.p
                  className="text-red-500 dark:text-red-400 text-sm mt-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {errors.proposal}
                </motion.p>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <motion.button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Bid"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

