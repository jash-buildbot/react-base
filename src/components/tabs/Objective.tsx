import "marktion/dist/style.css";
import { Editor } from "novel-lightweight";
import React from "react";
import { Label } from "@/components/ui/label";
import { useResumeStore } from "../../store/resumeStore";

const Objective: React.FC = () => {
  const { data, updateData,reload } = useResumeStore();

  const handleChange = (editor) => {
    updateData({ objective: { ...data.objective, body: editor?.storage.markdown.getMarkdown() } });
  };
  return (
    <div>
      <div>
        <Label htmlFor="objective">Objective</Label>
        <Editor
        key={reload}
          completionApi="http://localhost:3000/api/ai?system=Write a short objective for my resume"
          defaultValue={data.objective.body}
          disableLocalStorage={true}
          onUpdate={handleChange}
          className="relative min-h-[500px] w-full max-w-screen-lg border-stone-200 bg-white sm:mb-[calc(0vh)] sm:rounded-lg sm:border sm:shadow-lg"
        />
      </div>
    </div>
  );
};

export default Objective;
