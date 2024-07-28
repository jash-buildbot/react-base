export interface ResumeData {
  profile: {
    heading: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    website: string;
    photo: string;
    headline: string;
    address: {
      line1: string;
      line2: string;
      line3: string;
    };
  };
  objective: {
    heading: string;
    body: string;
  };
  video: {
    heading: string;
    enable: boolean;
    url: string;
  };
  work: {
    heading: string;
    enable: boolean;
    items: Array<{
      enable: boolean;
      id: string;
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      description: string;
    }>;
  };
  education: {
    heading: string;
    enable: boolean;
    items: Array<{
      enable: boolean;
      id: string;
      institution: string;
      degree: string;
      fieldOfStudy: string;
      graduationDate: string;
    }>;
  };
  awards: {
    heading: string;
    enable: boolean;
    items: Array<{
      enable: boolean;
      id: string;
      title: string;
      date: string;
      description: string;
    }>;
  };
  certifications: {
    heading: string;
    enable: boolean;
    items: Array<{
      enable: boolean;
      id: string;
      name: string;
      authority: string;
      date: string;
    }>;
  };
  skills: {
    heading: string;
    enable: boolean;
    items: Array<{
      enable: boolean;
      id: string;
      name: string;
      level: number;
    }>;
  };
  hobbies: {
    heading: string;
    enable: boolean;
    items: Array<{
      enable: boolean;
      id: string;
      name: string;
    }>;
  };
  languages: {
    heading: string;
    enable: boolean;
    items: Array<{
      enable: boolean;
      id: string;
      language: string;
      proficiency: string;
    }>;
  };
  references: {
    heading: string;
    enable: boolean;
    items: Array<{
      enable: boolean;
      id: string;
      name: string;
      relationship: string;
      contact: string;
    }>;
  };
  extras: {
    heading: string;
    enable: boolean;
    items: Array<{
      enable: boolean;
      id: string;
      title: string;
      description: string;
    }>;
  };
}

export interface Theme {
  font: {
    family: string;
    size: number;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  layout: string;
}
