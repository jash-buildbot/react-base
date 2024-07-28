import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResumeStore } from "../../store/resumeStore";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Profile: React.FC = () => {
  const { data, updateData } = useResumeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      updateData({ profile: { ...data.profile, address: { ...data.profile.address, [addressField]: value } } });
    } else {
      updateData({ profile: { ...data.profile, [name]: value } });
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateData({ profile: { ...data.profile, photo: reader.result as string } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="w-16 h-16 cursor-pointer" onClick={handleAvatarClick}>
          <AvatarImage src={data.profile.photo} alt="Profile picture" />
          <AvatarFallback>Add</AvatarFallback>
        </Avatar>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <div className="flex-1">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" value={data.profile.firstName} onChange={handleChange} />
        </div>
        <div className="flex-1">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" value={data.profile.lastName} onChange={handleChange} />
        </div>
      </div>
      <div className="flex space-x-4">
      </div>
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={data.profile.email} onChange={handleChange} />
        </div>
        <div className="flex-1">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" value={data.profile.phone} onChange={handleChange} />
        </div>
      </div>
      <div>
        <Label htmlFor="address1">Address Line 1</Label>
        <Input id="address1" name="address.line1" value={data.profile.address.line1} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="address2">Address Line 2</Label>
        <Input id="address2" name="address.line2" value={data.profile.address.line2} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="address3">Address Line 3</Label>
        <Input id="address3" name="address.line3" value={data.profile.address.line3} onChange={handleChange} />
      </div>
    </div>
  );
};

export default Profile;