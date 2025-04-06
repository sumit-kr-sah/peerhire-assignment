"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Briefcase, User, CheckCircle, Globe, DollarSign, Clock } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Set loaded state after a small delay for animations
    setTimeout(() => {
      setIsLoaded(true)
    }, 100)
  }, [])

  // Features lists
  const clientFeatures = [
    { icon: <User className="h-4 w-4 text-blue-500" />, text: "Find skilled freelancers" },
    { icon: <CheckCircle className="h-4 w-4 text-blue-500" />, text: "Post projects easily" },
    { icon: <Clock className="h-4 w-4 text-blue-500" />, text: "Track project progress" },
  ]

  const freelancerFeatures = [
    { icon: <Briefcase className="h-4 w-4 text-green-500" />, text: "Discover new projects" },
    { icon: <DollarSign className="h-4 w-4 text-green-500" />, text: "Set your own rates" },
    { icon: <Globe className="h-4 w-4 text-green-500" />, text: "Work from anywhere" },
  ]

  // Stats
  const stats = [
    { value: "10K+", label: "Freelancers" },
    { value: "5K+", label: "Clients" },
    { value: "25K+", label: "Projects" },
    { value: "₹100M+", label: "Paid Out" },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden transition-colors duration-300">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 dark:bg-blue-900 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-green-100 dark:bg-green-900 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-purple-100 dark:bg-purple-900 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block mb-4 px-4 py-1 bg-white dark:bg-slate-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm rounded-full shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              The Future of Work is Here
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            FreelanceConnect
          </motion.h1>

          <motion.p
            className="text-slate-600 dark:text-slate-300 text-lg md:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            The platform that connects talented freelancers with amazing clients for successful project collaborations.
          </motion.p>
        </motion.div>

        {/* Stats section */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer group"
            initial={{ opacity: 0, x: -50 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ y: -10 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/5 dark:to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-8 flex flex-col items-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform">
                <Briefcase className="h-10 w-10 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">I'm a Client</h2>

              <p className="text-slate-600 dark:text-slate-300 text-center mb-6">
                Find talented freelancers, manage projects, and get your work done efficiently.
              </p>

              <div className="space-y-2 mb-8 w-full">
                {clientFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  >
                    <div className="mr-3">{feature.icon}</div>
                    <span className="text-slate-700 dark:text-slate-200">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              <Link href="/client">
                <motion.button
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg shadow-md group-hover:shadow-lg transition-all w-full justify-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Enter Client View{" "}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden cursor-pointer group"
            initial={{ opacity: 0, x: 50 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ y: -10 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 dark:from-green-500/5 dark:to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-8 flex flex-col items-center relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform">
                <User className="h-10 w-10 text-white" />
              </div>

              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">I'm a Freelancer</h2>

              <p className="text-slate-600 dark:text-slate-300 text-center mb-6">
                Discover projects, submit proposals, and grow your freelance business.
              </p>

              <div className="space-y-2 mb-8 w-full">
                {freelancerFeatures.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  >
                    <div className="mr-3">{feature.icon}</div>
                    <span className="text-slate-700 dark:text-slate-200">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              <Link href="/freelancer">
                <motion.button
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg shadow-md group-hover:shadow-lg transition-all w-full justify-center"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Enter Freelancer View{" "}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom section with skills */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
        >
          <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
            Popular Skills on Our Platform
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "React",
              "Node.js",
              "UI/UX Design",
              "Python",
              "WordPress",
              "Mobile Development",
              "Digital Marketing",
              "Content Writing",
            ].map((skill, index) => (
              <motion.span
                key={index}
                className="px-4 py-2 bg-white dark:bg-slate-700 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 1 + index * 0.05 }}
                whileHover={{ y: -3, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="mt-16 text-center text-slate-500 dark:text-slate-400 text-sm"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <p>© 2023 FreelanceConnect. All rights reserved.</p>
        </motion.div>
      </div>
    </main>
  )
}

