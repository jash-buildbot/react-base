import { GripVertical, Edit, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useConfirm } from "@/components/ui/alert-dialog-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sortable, SortableItem, SortableDragHandle } from "@/components/ui/sortable";
import { useResumeStore } from "../../store/resumeStore";

const proficiencyLevels = ['Elementary', 'Limited Working', 'Professional Working', 'Full Professional', 'Native/Bilingual'];

interface LanguageItem {
  id: string;
  enable: boolean;
  language: string;
  proficiency: string;
}

const LanguageForm: React.FC<{
  item?: LanguageItem;
  onSave: (item: LanguageItem) => void;
  onClose: () => void;
}> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState<LanguageItem>(
    item || {
      id: uuidv4(),
      enable: false,
      language: "",
      proficiency: "",
    }
  );

  const handleChange = (field: keyof LanguageItem, value: string) => {
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
        <Label htmlFor="language">Language</Label>
        <Input
          id="language"
          value={formData.language}
          onChange={(e) => handleChange("language", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="proficiency">Proficiency</Label>
        <Select
          onValueChange={(value) => handleChange("proficiency", value)}
          value={formData.proficiency}
        >
          <SelectTrigger id="proficiency">
            <SelectValue placeholder="Select proficiency level" />
          </SelectTrigger>
          <SelectContent>
            {proficiencyLevels.map((level) => (
              <SelectItem key={level} value={level}>{level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DialogFooter>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
};

const Languages: React.FC = () => {
  const confirm = useConfirm();
  const { data, updateData } = useResumeStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LanguageItem | null>(null);

  const handleAdd = (newItem: LanguageItem) => {
    updateData({ languages: { ...data.languages, items: [...data.languages.items, newItem] } });
    setIsDialogOpen(false);
  };

  const handleEdit = (updatedItem: LanguageItem) => {
    const updatedItems = data.languages.items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
    updateData({ languages: { ...data.languages, items: updatedItems } });
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    if (
      await confirm({
        title: "Attention",
        body: `Are you sure you want to delete this language?`,
      })
    ) {
      const updatedItems = data.languages.items.filter((item) => item.id !== id);
      updateData({ languages: { ...data.languages, items: updatedItems } });
    }
  };

  const handleSortEnd = (newItems: LanguageItem[]) => {
    updateData({ languages: { ...data.languages, items: newItems } });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>Add Language</Button>
      </div>

      <div>
        <Sortable value={data.languages.items} onValueChange={handleSortEnd}>
          {data.languages.items.map((item) => (
            <SortableItem key={item.id} value={item.id} className="flex border">
              <SortableDragHandle variant="ghost" size="icon" className="h-100 w-8">
                <GripVertical className="size-4" aria-hidden="true" />
              </SortableDragHandle>
              <div className="flex-grow flex items-center gap-2 p-4 rounded">
                <div className="flex-grow">
                  <h3 className="font-bold">{item.language}</h3>
                  <p>{item.proficiency}</p>
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
            <DialogTitle>{editingItem ? "Edit" : "Add"} Language</DialogTitle>
          </DialogHeader>
          <LanguageForm
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

export default Languages;