import React from 'react'
import { useResumeStore } from '../../store/resumeStore'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const Actions: React.FC = () => {
  const { loadDemoData, resetData, saveData } = useResumeStore()
  const { toast } = useToast()

  const handleLoadDemo = () => {
    loadDemoData()
    toast({
      title: "Demo data loaded",
      description: "Your resume has been populated with sample data.",
    })
  }

  const handleReset = () => {
    resetData()
    toast({
      title: "Data reset",
      description: "Your resume has been reset to its initial state.",
    })
  }

  const handleSave = async () => {
    await saveData()
    toast({
      title: "Resume saved",
      description: "Your resume has been saved successfully.",
    })
  }

  return (
    <div className="space-y-4">
      <Button onClick={handleLoadDemo}>Load Demo Data</Button>
      <Button onClick={handleReset} variant="destructive">Reset Data</Button>
      <Button onClick={handleSave}>Save Resume</Button>
    </div>
  )
}

export default Actions