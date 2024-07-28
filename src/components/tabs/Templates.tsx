import React from 'react'
import { useResumeStore } from '../../store/resumeStore'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const templates = [
  { id: 'whiteminimalist', name: 'White Minimalist' },
  // Add more templates here
]

const Templates: React.FC = () => {
  const { theme, updateTheme } = useResumeStore()

  const handleTemplateChange = (value: string) => {
    updateTheme({ layout: value })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Choose a Template</h2>
      <RadioGroup value={theme.layout} onValueChange={handleTemplateChange}>
        {templates.map((template) => (
          <div key={template.id} className="flex items-center space-x-2">
            <RadioGroupItem value={template.id} id={template.id} />
            <Label htmlFor={template.id}>{template.name}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default Templates