import { GripVertical, Edit, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useConfirm } from "@/components/ui/alert-dialog-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sortable, SortableItem, SortableDragHandle } from "@/components/ui/sortable";
import { Textarea } from "@/components/ui/textarea";
import { useResumeStore } from "../../store/resumeStore";

interface WorkItem {
  id: string;
  enable: boolean;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

const WorkForm: React.FC<{
  item?: WorkItem;
  onSave: (item: WorkItem) => void;
  onClose: () => void;
}> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState<WorkItem>(
    item || {
      id: uuidv4(),
      enable: false,
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  );

  const handleChange = (field: keyof WorkItem, value: string) => {
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
        <Label htmlFor="company">Company</Label>
        <Input id="company" value={formData.company} onChange={(e) => handleChange("company", e.target.value)} />
      </div>
      <div>
        <Label htmlFor="position">Position</Label>
        <Input id="position" value={formData.position} onChange={(e) => handleChange("position", e.target.value)} />
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={4}
        />
      </div>
      <DialogFooter>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
};

const Work: React.FC = () => {
  const confirm = useConfirm();
  const { data, updateData } = useResumeStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkItem | null>(null);

  const handleAdd = (newItem: WorkItem) => {
    updateData({ work: { ...data.work, items: [...data.work.items, newItem] } });
    setIsDialogOpen(false);
  };

  const handleEdit = (updatedItem: WorkItem) => {
    const updatedItems = data.work.items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
    updateData({ work: { ...data.work, items: updatedItems } });
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
      const updatedItems = data.work.items.filter((item) => item.id !== id);
      updateData({ work: { ...data.work, items: updatedItems } });
    }
  };

  const handleSortEnd = (newItems: WorkItem[]) => {
    updateData({ work: { ...data.work, items: newItems } });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>Add Work Experience</Button>
      </div>

      <div>
        <Sortable value={data.work.items} onValueChange={handleSortEnd}>
          {data.work.items.map((item) => (
            <SortableItem key={item.id} value={item.id} className="flex border ">
              <SortableDragHandle variant="ghost" size="icon" className="h-100 w-8">
                <GripVertical className="size-4" aria-hidden="true" />
              </SortableDragHandle>
              <div className="flex-grow flex items-center gap-2 p-4 rounded">
                <div className="flex-grow">
                  <h3 className="font-bold">{item.company}</h3>
                  <p>{item.position}</p>
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
            <DialogTitle>{editingItem ? "Edit" : "Add"} Work Experience</DialogTitle>
          </DialogHeader>
          <WorkForm
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

export default Work;
