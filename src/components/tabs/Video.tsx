import React, { useRef, useState } from 'react'
import { useResumeStore } from '../../store/resumeStore'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const Video: React.FC = () => {
  const { data, updateData } = useResumeStore()
  const [isRecording, setIsRecording] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.start()
      setIsRecording(true)

      const chunks: Blob[] = []
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const videoUrl = URL.createObjectURL(blob)
        updateData({ video: { ...data.video, url: videoUrl } })
      }
    } catch (error) {
      console.error('Error accessing media devices:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="video-url">Video URL</Label>
        <Input 
          id="video-url"
          value={data.video.url}
          onChange={(e) => updateData({ video: { ...data.video, url: e.target.value } })}
          placeholder="Enter video URL or record a new one"
        />
      </div>
      <div>
      <video ref={videoRef} width="100%" height="auto" controls />
      </div>
      <div className="flex space-x-4">
        {!isRecording ? (
          <Button onClick={startRecording}>Start Recording</Button>
        ) : (
          <Button onClick={stopRecording} variant="destructive">Stop Recording</Button>
        )}
      </div>
    </div>
  )
}

export default Video