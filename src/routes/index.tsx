import { createFileRoute } from "@tanstack/react-router";
import {
  User,
  Target,
  Briefcase,
  GraduationCap,
  Award,
  ScrollText,
  Wrench,
  Palette,
  Globe,
  Users,
  Plus,
  Video as VideoIcon,
  FileUp,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Awards from "@/components/tabs/Awards";
import Certifications from "@/components/tabs/Certifications";
import Education from "@/components/tabs/Education";
import Extras from "@/components/tabs/Extras";
import Hobbies from "@/components/tabs/Hobbies";
import Languages from "@/components/tabs/Languages";
import Objective from "@/components/tabs/Objective";
import Profile from "@/components/tabs/Profile";
import References from "@/components/tabs/References";
import Skills from "@/components/tabs/Skills";
import Video from "@/components/tabs/Video";
import LoadResume from "@/components/tabs/LoadResume";
import Work from "@/components/tabs/Work";
import WhiteMinimalist from "@/components/templates/WhiteMinimalist";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useResumeStore } from "../store/resumeStore";

// Import all section components (Profile, Objective, etc.)

const ResumeBuilder: React.FC = () => {
  const { data, theme, loadDemoData } = useResumeStore();
  const [activeSection, setActiveSection] = useState("basics");
  const sectionsRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    loadDemoData();
  }, []);

  useEffect(() => {
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 0.5,
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id.startsWith("section-")) {
          setActiveSection(entry.target.id.split("section-")[1]);
        }
      });
    }, options);

    const sectionElements = sectionsRef.current?.querySelectorAll("[id]");
    sectionElements?.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const sectionElement = sectionsRef.current?.querySelector(`#section-${sectionId}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth" });
    }
    setActiveSection(sectionId);
  };

  const sections = [
    { id: "basics", icon: User, component: Profile },
    { id: "summary", icon: Target, component: Objective },
    { id: "work", icon: Briefcase, component: Work },
    { id: "education", icon: GraduationCap, component: Education },
    { id: "awards", icon: Award, component: Awards },
    { id: "certifications", icon: ScrollText, component: Certifications },
    { id: "skills", icon: Wrench, component: Skills },
    { id: "interests", icon: Palette, component: Hobbies },
    { id: "languages", icon: Globe, component: Languages },
    { id: "references", icon: Users, component: References },
    { id: "extras", icon: Plus, component: Extras },
    { id: "loadresume", icon: FileUp, component: LoadResume },
    // { id: 'video', icon: VideoIcon, component: Video },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* First column: Section icons */}
      <div className="w-12 border-r">
        <ScrollArea className="h-full">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant="ghost"
              size="icon"
              className={`w-full aspect-square rounded-none ${
                activeSection === section.id ? "bg-secondary text-secondary-foreground" : ""
              }`}
              onClick={() => scrollToSection(section.id)}
            >
              {React.createElement(section.icon, { className: "h-4 w-4" }) as React.ReactNode}
            </Button>
          ))}
        </ScrollArea>
      </div>

      {/* Second column: Longform content */}
      <div className="flex-1 border-r">
        <ScrollArea className="h-full my-4">
          <div ref={sectionsRef}>
            {sections.map((section) => (
              <div key={section.id} id={`section-${section.id}`} className="px-6">
                <div className="text-2xl font-semibold mb-4 capitalize flex items-center gap-2">
                  {React.createElement(section.icon, { className: "h-5 w-5 bold" }) as React.ReactNode}
                  <h1>{section.id}</h1>{" "}
                </div>
                <section.component />
                <Separator className="my-6" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Third column: Resume preview */}
      <div className="w-1/2 p-4">
        <ScrollArea className="h-full border rounded-md">
          <div className="p-4">
            <WhiteMinimalist data={data} theme={theme} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export const Route = createFileRoute("/")({
  component: ResumeBuilder,
});
