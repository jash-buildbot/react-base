import React from 'react'
import { useResumeStore } from '../../store/resumeStore'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

const fontFamilies = [
  'Arial', 'Helvetica', 'Times New Roman', 'Courier', 'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS', 'Arial Black', 'Impact'
]

const Fonts: React.FC = () => {
  const { theme, updateTheme } = useResumeStore()

  const handleFontFamilyChange = (value: string) => {
    updateTheme({ font: { ...theme.font, family: value } })
  }

  const handleFontSizeChange = (value: number[]) => {
    updateTheme({ font: { ...theme.font, size: value[0] } })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="font-family">Font Family</Label>
        <Select onValueChange={handleFontFamilyChange} value={theme.font.family}>
          <SelectTrigger id="font-family">
            <SelectValue placeholder="Select a font family" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((font) => (
              <SelectItem key={font} value={font}>{font}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="font-size">Font Size: {theme.font.size}px</Label>
        <Slider
          id="font-size"
          min={8}
          max={24}
          step={1}
          value={[theme.font.size]}
          onValueChange={handleFontSizeChange}
        />
      </div>
    </div>
  )
}

export default Fonts