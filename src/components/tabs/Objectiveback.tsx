import React from 'react'
import { useResumeStore } from '../../store/resumeStore'
import { Label } from "@/components/ui/label"
import { ReactEditor,Marktion,useAI } from 'marktion'
import "marktion/dist/style.css";

const Objective: React.FC = () => {
const { data, updateData } = useResumeStore()
const ai = useAI({
    api: "http://localhost:3000/api/ai",
    body:{
            prompt: "Write a short objective for my resume",
    }
});
console.log(ai.plugin, ai.element)

const handleChange = (editor: Marktion) => {
    updateData({ objective: { ...data.objective, body: editor.getContent() } });
};
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="objective">Objective</Label>
        <ReactEditor
          plugins={[ai.plugin]}
          content={data.objective.body}
          onChange={handleChange}  
          className="min-h-[200px] p-2 border rounded"
        >
            {ai.element}
        </ReactEditor>
      </div>
    </div>
  )
}

export default Objective