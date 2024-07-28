import { GripVertical, Edit, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useConfirm } from "@/components/ui/alert-dialog-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sortable, SortableItem, SortableDragHandle } from "@/components/ui/sortable";
import { useResumeStore } from "../../store/resumeStore";

interface EducationItem {
  id: string;
  enable: boolean;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationDate: string;
}

const EducationForm: React.FC<{
  item?: EducationItem;
  onSave: (item: EducationItem) => void;
  onClose: () => void;
}> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState<EducationItem>(
    item || {
      id: uuidv4(),
      enable: false,
      institution: "",
      degree: "",
      fieldOfStudy: "",
      graduationDate: "",
    },
  );

  const handleChange = (field: keyof EducationItem, value: string) => {
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
        <Label htmlFor="institution">Institution</Label>
        <Input
          id="institution"
          value={formData.institution}
          onChange={(e) => handleChange("institution", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="degree">Degree</Label>
        <Input
          id="degree"
          value={formData.degree}
          onChange={(e) => handleChange("degree", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="fieldOfStudy">Field of Study</Label>
        <Input
          id="fieldOfStudy"
          value={formData.fieldOfStudy}
          onChange={(e) => handleChange("fieldOfStudy", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="graduationDate">Graduation Date</Label>
        <Input
          id="graduationDate"
          type="date"
          value={formData.graduationDate}
          onChange={(e) => handleChange("graduationDate", e.target.value)}
        />
      </div>
      <DialogFooter>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
};

const Education: React.FC = () => {
  const confirm = useConfirm();
  const { data, updateData } = useResumeStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);

  const handleAdd = (newItem: EducationItem) => {
    updateData({ education: { ...data.education, items: [...data.education.items, newItem] } });
    setIsDialogOpen(false);
  };

  const handleEdit = (updatedItem: EducationItem) => {
    const updatedItems = data.education.items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
    updateData({ education: { ...data.education, items: updatedItems } });
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    if (
      await confirm({
        title: "Attention",
        body: `Are you sure you want to delete this?`,
      })
    ) {
      const updatedItems = data.education.items.filter((item) => item.id !== id);
      updateData({ education: { ...data.education, items: updatedItems } });
    }
  };

  const handleSortEnd = (newItems: EducationItem[]) => {
    updateData({ education: { ...data.education, items: newItems } });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>Add Education</Button>
      </div>

      <div>
        <Sortable value={data.education.items} onValueChange={handleSortEnd}>
          {data.education.items.map((item) => (
            <SortableItem key={item.id} value={item.id} className="flex border">
              <SortableDragHandle variant="ghost" size="icon" className="h-100 w-8">
                <GripVertical className="size-4" aria-hidden="true" />
              </SortableDragHandle>
              <div className="flex-grow flex items-center gap-2 p-4 rounded">
                <div className="flex-grow">
                  <h3 className="font-bold">{item.institution}</h3>
                  <p>{item.degree} in {item.fieldOfStudy}</p>
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
            <DialogTitle>{editingItem ? "Edit" : "Add"} Education</DialogTitle>
          </DialogHeader>
          <EducationForm
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

export default Education;