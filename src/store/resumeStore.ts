import create from 'zustand'
import { persist } from 'zustand/middleware'
import { ResumeData, Theme } from '../types/index'

interface ResumeStore {
  data: ResumeData
  theme: Theme
  loadDemoData: () => void
  resetData: () => void
  saveData: () => Promise<void>
  updateData: (newData: Partial<ResumeData>) => void
  updateTheme: (newTheme: Partial<Theme>) => void,
  reload?: number
}

// const initialData: ResumeData = {
//   profile: { heading: 'Profile',photo:"", firstName: '', lastName: '', email: '', phone: '',website:'',headline:'', address: { line1: '', line2: '', line3: '' } },
//   objective: { heading: 'Objective', body: '' },
//   work: { enable:false,heading: 'Work Experience', items: [] },
//   education: { enable:false,heading: 'Education', items: [] },
//   awards: { enable:false,heading: 'Awards', items: [] },
//   certifications: { enable:false,heading: 'Certifications', items: [] },
//   skills: { enable:false,heading: 'Skills', items: [] },
//   hobbies: { enable:false,heading: 'Hobbies', items: [] },
//   languages: { enable:false,heading: 'Languages', items: [] },
//   references: { enable:false,heading: 'References', items: [] },
//   extras: { enable:false,heading: 'Extras', items: [] },
//   video: { enable:false,heading: 'Video', url: '' },
// }

const initialData: ResumeData = {
  "profile": {
    "heading": "Profile",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1 (555) 123-4567",
    "website": "https://johndoe.com",
    "photo": "https://example.com/johndoe.jpg",
    "headline": "Experienced Software Engineer",
    "address": {
      "line1": "123 Main St",
      "line2": "Apt 4B",
      "line3": "New York, NY 10001"
    }
  },
  "objective": {
    "heading": "Career Objective",
    "body": "Seeking a challenging position in a reputable organization to expand and utilize my learning, skills and knowledge."
  },
  "video": {
    "heading": "Introduction Video",
    "enable": true,
    "url": "https://youtube.com/watch?v=dQw4w9WgXcQ"
  },
  "work": {
    "heading": "Work Experience",
    "enable": true,
    "items": [
      {
        "enable": true,
        "id": "work1",
        "company": "Tech Solutions Inc.",
        "position": "Senior Software Engineer",
        "startDate": "2018-03-01",
        "endDate": "2023-07-15",
        "description": "Led a team of developers in creating innovative software solutions for enterprise clients."
      },
      {
        "enable": true,
        "id": "work2",
        "company": "StartUp Innovations",
        "position": "Full Stack Developer",
        "startDate": "2015-06-15",
        "endDate": "2018-02-28",
        "description": "Developed and maintained web applications using modern JavaScript frameworks."
      }
    ]
  },
  "education": {
    "heading": "Education",
    "enable": true,
    "items": [
      {
        "enable": true,
        "id": "edu1",
        "institution": "University of Technology",
        "degree": "Bachelor of Science",
        "fieldOfStudy": "Computer Science",
        "graduationDate": "2015-05-15"
      }
    ]
  },
  "awards": {
    "heading": "Awards",
    "enable": true,
    "items": [
      {
        "enable": true,
        "id": "award1",
        "title": "Employee of the Year",
        "date": "2022-12-15",
        "description": "Recognized for outstanding performance and contributions to the company."
      }
    ]
  },
  "certifications": {
    "heading": "Certifications",
    "enable": true,
    "items": [
      {
        "enable": true,
        "id": "cert1",
        "name": "AWS Certified Solutions Architect",
        "authority": "Amazon Web Services",
        "date": "2021-08-30"
      }
    ]
  },
  "skills": {
    "heading": "Skills",
    "enable": true,
    "items": [
      {
        "enable": true,
        "id": "skill1",
        "name": "JavaScript",
        "level": 9
      },
      {
        "enable": true,
        "id": "skill2",
        "name": "React",
        "level": 8
      }
    ]
  },
  "hobbies": {
    "heading": "Hobbies",
    "enable": true,
    "items": [
      {
        "enable": true,
        "id": "hobby1",
        "name": "Photography"
      },
      {
        "enable": true,
        "id": "hobby2",
        "name": "Hiking"
      }
    ]
  },
  "languages": {
    "heading": "Languages",
    "enable": true,
    "items": [
      {
        "enable": true,
        "id": "lang1",
        "language": "English",
        "proficiency": "Native"
      },
      {
        "enable": true,
        "id": "lang2",
        "language": "Spanish",
        "proficiency": "Intermediate"
      }
    ]
  },
  "references": {
    "heading": "References",
    "enable": true,
    "items": [
      {
        "enable": true,
        "id": "ref1",
        "name": "Jane Smith",
        "relationship": "Former Manager",
        "contact": "jane.smith@example.com"
      }
    ]
  },
  "extras": {
    "heading": "Additional Information",
    "enable": true,
    "items": [
      {
        "enable": true,
        "id": "extra1",
        "title": "Volunteer Work",
        "description": "Regularly volunteer at local animal shelter"
      }
    ]
  },
  // "theme": {
  //   "font": {
  //     "family": "Arial, sans-serif",
  //     "size": 14
  //   },
  //   "colors": {
  //     "primary": "#333333",
  //     "secondary": "#666666",
  //     "accent": "#0077be"
  //   },
  //   "layout": "modern"
  // }
}

const initialTheme: Theme = {
  font: { family: 'Arial', size: 16 },
  colors: { primary: '#000000', secondary: '#ffffff', accent: '#4a90e2' },
  layout: 'whiteminimalist'
}

export const useResumeStore = create(
  persist<ResumeStore>(
    (set, get) => ({
      data: initialData,
      theme: initialTheme,
      reload:0,
      loadDemoData: () => {
        // In a real app, you'd load demo data from an API or file
        set({ data: { ...initialData, profile: { ...initialData.profile, firstName: 'John', lastName: 'Doe' } } })
      },
      loadData: (data: ResumeData) => {
        // In a real app, you'd load demo data from an API or file
        set({ data,reload:Math.random() })
      },
      resetData: () => set({ data: initialData, theme: initialTheme }),
      saveData: async () => {
        // In a real app, you'd save to an API here
        console.log('Saving data:', get().data)
      },
      updateData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
      updateTheme: (newTheme) => set((state) => ({ theme: { ...state.theme, ...newTheme } })),
    }),
    {
      name: 'resume-storage',
      getStorage: () => localStorage,
    }
  )
)