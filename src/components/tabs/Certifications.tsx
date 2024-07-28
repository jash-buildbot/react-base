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

interface CertificationItem {
  id: string;
  enable: boolean;
  name: string;
  authority: string;
  date: string;
}

const CertificationForm: React.FC<{
  item?: CertificationItem;
  onSave: (item: CertificationItem) => void;
  onClose: () => void;
}> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState<CertificationItem>(
    item || {
      id: uuidv4(),
      enable: false,
      name: "",
      authority: "",
      date: "",
    },
  );

  const handleChange = (field: keyof CertificationItem, value: string) => {
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
        <Label htmlFor="name">Certification Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="authority">Issuing Authority</Label>
        <Input
          id="authority"
          value={formData.authority}
          onChange={(e) => handleChange("authority", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="date">Date Issued</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />
      </div>
      <DialogFooter>
        <Button type="submit">Save</Button>
      </DialogFooter>
    </form>
  );
};

const Certifications: React.FC = () => {
  const confirm = useConfirm();
  const { data, updateData } = useResumeStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CertificationItem | null>(null);

  const handleAdd = (newItem: CertificationItem) => {
    updateData({ certifications: { ...data.certifications, items: [...data.certifications.items, newItem] } });
    setIsDialogOpen(false);
  };

  const handleEdit = (updatedItem: CertificationItem) => {
    const updatedItems = data.certifications.items.map((item) => (item.id === updatedItem.id ? updatedItem : item));
    updateData({ certifications: { ...data.certifications, items: updatedItems } });
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: string) => {
    if (
      await confirm({
        title: "Attention",
        body: `Are you sure you want to delete this certification?`,
      })
    ) {
      const updatedItems = data.certifications.items.filter((item) => item.id !== id);
      updateData({ certifications: { ...data.certifications, items: updatedItems } });
    }
  };

  const handleSortEnd = (newItems: CertificationItem[]) => {
    updateData({ certifications: { ...data.certifications, items: newItems } });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setIsDialogOpen(true)}>Add Certification</Button>
      </div>

      <div>
        <Sortable value={data.certifications.items} onValueChange={handleSortEnd}>
          {data.certifications.items.map((item) => (
            <SortableItem key={item.id} value={item.id} className="flex border">
              <SortableDragHandle variant="ghost" size="icon" className="h-100 w-8">
                <GripVertical className="size-4" aria-hidden="true" />
              </SortableDragHandle>
              <div className="flex-grow flex items-center gap-2 p-4 rounded">
                <div className="flex-grow">
                  <h3 className="font-bold">{item.name}</h3>
                  <p>{item.authority} - {item.date}</p>
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
            <DialogTitle>{editingItem ? "Edit" : "Add"} Certification</DialogTitle>
          </DialogHeader>
          <CertificationForm
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

export default Certifications;