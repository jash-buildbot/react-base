import React from 'react'
import { useResumeStore } from '../../store/resumeStore'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const Colors: React.FC = () => {
  const { theme, updateTheme } = useResumeStore()

  const handleColorChange = (colorType: 'primary' | 'secondary' | 'accent', value: string) => {
    updateTheme({ colors: { ...theme.colors, [colorType]: value } })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="primary-color">Primary Color</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="primary-color"
            type="color"
            value={theme.colors.primary}
            onChange={(e) => handleColorChange('primary', e.target.value)}
            className="w-12 h-12 p-1 rounded"
          />
          <Input
            type="text"
            value={theme.colors.primary}
            onChange={(e) => handleColorChange('primary', e.target.value)}
            className="flex-grow"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="secondary-color">Secondary Color</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="secondary-color"
            type="color"
            value={theme.colors.secondary}
            onChange={(e) => handleColorChange('secondary', e.target.value)}
            className="w-12 h-12 p-1 rounded"
          />
          <Input
            type="text"
            value={theme.colors.secondary}
            onChange={(e) => handleColorChange('secondary', e.target.value)}
            className="flex-grow"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="accent-color">Accent Color</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="accent-color"
            type="color"
            value={theme.colors.accent}
            onChange={(e) => handleColorChange('accent', e.target.value)}
            className="w-12 h-12 p-1 rounded"
          />
          <Input
            type="text"
            value={theme.colors.accent}
            onChange={(e) => handleColorChange('accent', e.target.value)}
            className="flex-grow"
          />
        </div>
      </div>
    </div>
  )
}

export default Colors