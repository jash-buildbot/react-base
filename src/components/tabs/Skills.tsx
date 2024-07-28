import { GripVertical, Edit, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useConfirm } from "@/components/ui/alert-dialog-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sortable, SortableItem, SortableDragHandle } from "@/components/ui/sortable";
import { Slider } from "@/components/ui/slider";
import { useResumeStore } from "../../store/resumeStore";

interface SkillItem {
  id: string;
  enable: boolean;
  name: string;
  level: number;
}

const SkillForm: React.FC<{
  item?: SkillItem;
  onSave: (item: SkillItem) => void;
  onClose: () => void;
}> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState<SkillItem>(
    item || {
      id: uuidv4(),
      enable: false,
      name: "",
      level: 0,
    },
  );

  const handleChange = (field: keyof SkillItem, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Skill Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="level">Skill Level: {formData.level}</Label>
        <Slider
          id="level"
          min={0}
          max={100}
          step={1}
          value={[formData.level]}
          onValueChange={(value) => handleChange("level", value[0])}
        />
      </div>
      <DialogFooter>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
};

const Skills: React.FC = () => {
  const confirm = useConfirm();
  const { data, updateData } = useResumeStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SkillItem | null>(null);

  const handleAdd = (newItem: SkillItem) => {
    updateData({ skills: { ...data.skills, items: [...data.skills.items, newItem] } });
    setIsDialogOpen(false);
  };

  const handleEdit = (updatedItem: SkillItem) => {
    const updatedItems = data.skills.items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
    updateData({ skills: { ...data.skills, items: updatedItems } });
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    if (
      await confirm({
        title: "Attention",
        body: `Are you sure you want to delete this skill?`,
      })
    ) {
      const updatedItems = data.skills.items.filter((item) => item.id !== id);
      updateData({ skills: { ...data.skills, items: updatedItems } });
    }
  };

  const handleSortEnd = (newItems: SkillItem[]) => {
    updateData({ skills: { ...data.skills, items: newItems } });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>Add Skill</Button>
      </div>

      <div>
        <Sortable value={data.skills.items} onValueChange={handleSortEnd}>
          {data.skills.items.map((item) => (
            <SortableItem key={item.id} value={item.id} className="flex border">
              <SortableDragHandle variant="ghost" size="icon" className="h-100 w-8">
                <GripVertical className="size-4" aria-hidden="true" />
              </SortableDragHandle>
              <div className="flex-grow flex items-center gap-2 p-4 rounded">
                <div className="flex-grow">
                  <h3 className="font-bold">{item.name}</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${item.level}%` }}></div>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setEditingItem(item);
                    setIsDialogOpen(true);
                  }}
                  variant="outline"
                  size="icon"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </SortableItem>
          ))}
        </Sortable>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit" : "Add"} Skill</DialogTitle>
          </DialogHeader>
          <SkillForm
            item={editingItem || undefined}
            onSave={editingItem ? handleEdit : handleAdd}
            onClose={() => {
              setIsDialogOpen(false);
              setEditingItem(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Skills;