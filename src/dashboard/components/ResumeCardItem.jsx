import { Loader2Icon, MoreVertical } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import GlobalApi from './../../../service/GlobalApi';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

function ResumeCardItem({ resume, refreshData, className }) {
  const navigation = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const getContrastColor = (hexColor) => {
    if (!hexColor) return '#ffffff'; // Default to white if no color is provided
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128 ? '#000000' : '#ffffff';
  };

  const textColor = getContrastColor(resume?.themeColor || '#4f46e5'); // Fallback to indigo-600

  const onDelete = () => {
    setLoading(true);
    GlobalApi.DeleteResumeById(resume.documentId).then(
      (resp) => {
        toast.success('Resume deleted successfully');
        refreshData();
      },
      (error) => {
        toast.error('Failed to delete resume');
      }
    ).finally(() => {
      setLoading(false);
      setOpenAlert(false);
    });
  };

  return (
    <motion.div 
      className={`relative overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all ${className}`}
      whileHover={{ y: -5 }}
    >
      <Link to={`/dashboard/resume/${resume.documentId}/edit`}>
        <div 
          className="h-48 bg-gradient-to-br from-gray-800 to-gray-200 flex items-center justify-center"
          style={{
            borderTop: `4px solid ${resume?.themeColor || '#4f46e5'}`,
            background: resume?.themeColor 
              ? `linear-gradient(135deg, ${resume.themeColor}20, ${resume.themeColor}40)` 
              : undefined
          }}
        >
          <div className="p-4 bg-white/10 rounded-lg shadow-sm">
            <img 
              src="/cv.png" 
              width={60} 
              height={60} 
              alt="Resume Icon" 
              className="transition-transform duration-300 group-hover:scale-110" 
            />
          </div>
        </div>
      </Link>

      <div 
        className="p-3 flex justify-between items-center bg-purple-400 border-t border-gray-100"
        style={{
          borderBottom: `4px solid ${resume?.themeColor || '#4f46e5'}`,
        }}
      >
        <h2 
          className="text-sm font-medium text-gray-800 truncate max-w-[160px]"
          style={{ color: resume?.themeColor ? textColor : '#4f46e5' }}
        >
          {resume.title}
        </h2>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <MoreVertical 
              className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700" 
              style={{ color: resume?.themeColor ? textColor : '#6b7280' }}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40 bg-white shadow-lg rounded-md border border-gray-200">
            <DropdownMenuItem 
              onClick={() => navigation(`/dashboard/resume/${resume.documentId}/edit`)}
              className="cursor-pointer hover:bg-gray-50"
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigation(`/my-resume/${resume.documentId}/view`)}
              className="cursor-pointer hover:bg-gray-50"
            >
              View
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => navigation(`/my-resume/${resume.documentId}/view`)}
              className="cursor-pointer hover:bg-gray-50"
            >
              Download
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setOpenAlert(true)}
              className="cursor-pointer text-red-600 hover:bg-red-50"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
          <AlertDialogContent className="bg-white rounded-lg max-w-[95%] sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-semibold text-gray-800">
                Confirm Deletion
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-600">
                This will permanently delete your resume. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-gray-300 hover:bg-gray-50 text-gray-700">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={onDelete} 
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
}

export default ResumeCardItem;