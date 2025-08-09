"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/AuthContext"
import { CheckSquare, Clock, DollarSign, Lock, Upload, Loader2 } from "lucide-react"
import axios from "axios"

interface Task {
  id: string
  title: string
  description: string
  reward: number
  status: "available" | "pending" | "completed" | "rejected"
  category: string
  timeEstimate: string
  requirements: string[]
  url?: string
}

export function TaskPage() {
  const { user, refreshUser } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingTask, setSubmittingTask] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [submitForm, setSubmitForm] = useState({
    screenshotUrl: "",
    notes: ""
  })
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false)

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const apiUrl = import.meta.env.VITE_API_URL || 'https://easyearn-backend-production-01ac.up.railway.app'
      console.log('Fetching tasks from:', `${apiUrl}/api/tasks`)
      
      const response = await axios.get(`${apiUrl}/api/tasks`, {
        withCredentials: true
      })
      
      console.log('Tasks response:', response.data)
      
      if (response.data.success) {
        setTasks(response.data.tasks)
        console.log('Tasks loaded:', response.data.tasks.length)
      } else {
        setTasks([])
        console.log('No tasks found or API error')
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      console.error('Error details:', error.response?.data || error.message)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
    // Refresh user data to get updated deposit status
    if (refreshUser) {
      refreshUser()
    }
  }, [refreshUser])

  // Handle screenshot upload using dedicated Cloudinary endpoint
  const handleScreenshotUpload = async (file: File) => {
    try {
      setUploadingScreenshot(true)
      const formData = new FormData()
      formData.append('screenshot', file) // Changed from 'file' to 'screenshot'
      const apiUrl = import.meta.env.VITE_API_URL || 'https://easyearn-backend-production-01ac.up.railway.app'

      const response = await axios.post(
        `${apiUrl}/api/upload-task-screenshot`, // Using dedicated endpoint
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (response.data.url) {
        setSubmitForm(prev => ({ ...prev, screenshotUrl: response.data.url }))
        console.log('Task screenshot uploaded to Cloudinary:', response.data.url)
      }
    } catch (error: any) {
      console.error('Error uploading screenshot:', error)
      const errorMessage = error.response?.data?.error || 'Failed to upload screenshot. Please try again.'
      alert(errorMessage)
    } finally {
      setUploadingScreenshot(false)
    }
  }

  // Handle task submission
  const handleTaskSubmission = async () => {
    if (!selectedTask) return

    try {
      setSubmittingTask(selectedTask.id)
      const apiUrl = import.meta.env.VITE_API_URL || 'https://easyearn-backend-production-01ac.up.railway.app'
      
      const response = await axios.post(
        `${apiUrl}/api/tasks/${selectedTask.id}/submit`,
        submitForm,
        { withCredentials: true }
      )

      if (response.data.success) {
        // Update task status to pending
        setTasks(tasks.map(task => 
          task.id === selectedTask.id ? { ...task, status: 'pending' } : task
        ))
        
        setIsSubmitDialogOpen(false)
        setSelectedTask(null)
        setSubmitForm({ screenshotUrl: "", notes: "" })
        
        alert('Task submitted successfully! Please wait for admin review.')
      }
    } catch (error: any) {
      console.error('Error submitting task:', error)
      alert(error.response?.data?.error || 'Failed to submit task. Please try again.')
    } finally {
      setSubmittingTask(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Social Media":
        return "bg-purple-100 text-purple-800"
      case "App Store":
        return "bg-orange-100 text-orange-800"
      case "Survey":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user?.hasDeposited) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Lock className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tasks Locked</h1>
          <p className="text-gray-600 mb-6">
            You need to make a minimum $10 deposit to unlock task earning features.
          </p>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Status: <span className="font-semibold">Tasks not unlocked yet</span>
              </p>
              <p className="text-sm text-yellow-800 mt-1">
                Make a minimum $10 deposit to unlock tasks (first $10 is used for unlocking, additional amounts go to your balance)
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button asChild>
                <a href="/deposit">Make Your First Deposit</a>
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  if (refreshUser) {
                    refreshUser()
                  }
                }}
              >
                Refresh Status
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
        <h1 className="text-3xl font-bold text-gray-900">Available Tasks</h1>
        <p className="text-gray-600 mt-2">Complete tasks to earn money</p>
          </div>
          <Button
            variant="outline"
            onClick={fetchTasks}
            disabled={loading}
            className="ml-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <span>Refresh</span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getCategoryColor(task.category)}>{task.category}</Badge>
                    <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">${task.reward}</div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {task.timeEstimate}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{task.description}</p>
              
              <div className="space-y-2 mb-4">
                <h4 className="font-medium text-sm">Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {task.requirements.map((req, index) => (
                    <li key={index} className="flex items-center">
                      <CheckSquare className="h-3 w-3 mr-2 text-green-500" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex space-x-2">
                 {(task.status === "available" || task.status === "rejected") && (
                   <>
                     {task.url && (
                       <Button
                         asChild
                         variant="outline"
                         className="flex-1"
                       >
                         <a 
                           href={task.url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                         >
                           Open Task
                         </a>
                       </Button>
                     )}
                     <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                       <DialogTrigger asChild>
                         <Button
                           onClick={() => setSelectedTask(task)}
                           className="flex-1"
                         >
                           {task.status === "rejected" ? "Start Task Again" : "Start Task"}
                         </Button>
                       </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Submit Task Completion</DialogTitle>
                            <DialogDescription>
                              Upload a screenshot as proof and add any notes about your completion.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="screenshot">Screenshot Proof</Label>
                              <div className="flex items-center space-x-2">
                                <Input
                                  id="screenshot"
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      handleScreenshotUpload(file)
                                    }
                                  }}
                                  disabled={uploadingScreenshot}
                                />
                                {uploadingScreenshot && (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                              </div>
                              {submitForm.screenshotUrl && (
                                <div className="text-sm text-green-600">
                                  ✓ Screenshot uploaded successfully
                                </div>
                              )}
                            </div>

                            <div className="grid gap-2">
                              <Label htmlFor="notes">Notes (Optional)</Label>
                              <Textarea
                                id="notes"
                                placeholder="Add any additional notes about your task completion..."
                                value={submitForm.notes}
                                onChange={(e) => setSubmitForm(prev => ({ ...prev, notes: e.target.value }))}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={handleTaskSubmission}
                              disabled={!submitForm.screenshotUrl || submittingTask === selectedTask?.id}
                            >
                              {submittingTask === selectedTask?.id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Submitting...
                                </>
                              ) : (
                                'Submit Task'
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                   </>
                 )}
                {task.status === "pending" && (
                  <Button variant="outline" className="flex-1" disabled>
                    Pending Review
                  </Button>
                )}
                {task.status === "completed" && (
                  <Button variant="outline" className="flex-1" disabled>
                    Completed
                  </Button>
                )}
                                 {/* Removed the separate rejected button since it's now handled above */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 