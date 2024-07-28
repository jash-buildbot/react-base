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

interface HobbyItem {
  id: string;
  enable: boolean;
  name: string;
}

const HobbyForm: React.FC<{
  item?: HobbyItem;
  onSave: (item: HobbyItem) => void;
  onClose: () => void;
}> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState<HobbyItem>(
    item || {
      id: uuidv4(),
      enable: false,
      name: "",
    }
  );

  const handleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, name: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Hobby Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      <DialogFooter>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
};

const Hobbies: React.FC = () => {
  const confirm = useConfirm();
  const { data, updateData } = useResumeStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HobbyItem | null>(null);

  const handleAdd = (newItem: HobbyItem) => {
    updateData({ hobbies: { ...data.hobbies, items: [...data.hobbies.items, newItem] } });
    setIsDialogOpen(false);
  };

  const handleEdit = (updatedItem: HobbyItem) => {
    const updatedItems = data.hobbies.items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
    updateData({ hobbies: { ...data.hobbies, items: updatedItems } });
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    if (
      await confirm({
        title: "Attention",
        body: `Are you sure you want to delete this hobby?`,
      })
    ) {
      const updatedItems = data.hobbies.items.filter((item) => item.id !== id);
      updateData({ hobbies: { ...data.hobbies, items: updatedItems } });
    }
  };

  const handleSortEnd = (newItems: HobbyItem[]) => {
    updateData({ hobbies: { ...data.hobbies, items: newItems } });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>Add Hobby</Button>
      </div>

      <div>
        <Sortable value={data.hobbies.items} onValueChange={handleSortEnd}>
          {data.hobbies.items.map((item) => (
            <SortableItem key={item.id} value={item.id} className="flex border">
              <SortableDragHandle variant="ghost" size="icon" className="h-100 w-8">
                <GripVertical className="size-4" aria-hidden="true" />
              </SortableDragHandle>
              <div className="flex-grow flex items-center gap-2 p-4 rounded">
                <div className="flex-grow">
                  <h3 className="font-bold">{item.name}</h3>
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
            <DialogTitle>{editingItem ? "Edit" : "Add"} Hobby</DialogTitle>
          </DialogHeader>
          <HobbyForm
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

export default Hobbies;