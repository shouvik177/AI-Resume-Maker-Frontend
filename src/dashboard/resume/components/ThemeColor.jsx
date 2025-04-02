import React, { useContext, useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "./../../../../service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

function ThemeColor() {
  const colorGroups = {
    Professional: ["#2563eb", "#1e40af", "#1e3a8a", "#1c64f2", "#3b82f6"],
    Vibrant: ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#A133FF"],
    Elegant: ["#6b7280", "#4b5563", "#374151", "#1f2937", "#111827"],
  };

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [selectedColor, setSelectedColor] = useState("#2563eb");
  const [activeTab, setActiveTab] = useState("Professional");
  const { resumeId } = useParams();

  // Initialize color from resumeInfo
  useEffect(() => {
    if (resumeInfo?.themeColor) {
      setSelectedColor(resumeInfo.themeColor);
    }
  }, [resumeInfo]);

  const onColorSelect = async (color) => {
    try {
      // Optimistic UI update
      setSelectedColor(color);
      setResumeInfo((prev) => ({ ...prev, themeColor: color }));

      // API call
      const response = await GlobalApi.UpdateResumeDetail(resumeId, {
        themeColor: color.toLowerCase() // Ensure lowercase hex
      });

      if (!response.data) {
        throw new Error("API returned no data");
      }

      toast.success("Theme updated!");
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      setSelectedColor(resumeInfo?.themeColor || "#2563eb");
      toast.error("Update failed. See console for details.");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          <Palette className="h-4 w-4" />
          <span>Theme</span>
          <span
            className="h-3 w-3 rounded-full border"
            style={{ backgroundColor: selectedColor }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Select Color</h3>
          <div className="flex border-b">
            {Object.keys(colorGroups).map((group) => (
              <button
                key={group}
                className={`px-2 pb-2 text-xs ${activeTab === group ? "border-b-2 border-primary font-semibold" : "text-gray-500"}`}
                onClick={() => setActiveTab(group)}
              >
                {group}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2">
            {colorGroups[activeTab].map((color) => (
              <button
                key={color}
                onClick={() => onColorSelect(color)}
                className={`h-6 w-6 rounded-full ${selectedColor === color ? "ring-2 ring-offset-2 ring-gray-400" : "hover:ring-1 hover:ring-gray-300"}`}
                style={{ backgroundColor: color }}
                aria-label={`Color ${color}`}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ThemeColor;