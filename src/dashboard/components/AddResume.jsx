import { Loader2, Plus } from 'lucide-react';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import GlobalApi from './../../../service/GlobalApi';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

function AddResume({ className, asButton }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateInput = () => {
    const trimmedTitle = resumeTitle.trim();
    if (!trimmedTitle) {
      toast.error('Please enter a resume title');
      return false;
    }
    if (trimmedTitle.length > 50) {
      toast.error('Title must be 50 characters or less');
      return false;
    }
    return true;
  };

  const handleCreateResume = async () => {
    if (!validateInput() || !user) return;
    
    setLoading(true);
    try {
      const requestData = {
        data: {
          title: resumeTitle.trim(),
          resumeId: uuidv4(),
          userEmail: user.primaryEmailAddress.emailAddress,
          userName: user.fullName || 'Anonymous'
        }
      };

      const response = await GlobalApi.CreateNewResume(requestData);
      
      if (response?.data?.data?.documentId) {
        toast.success('Resume created successfully!');
        navigate(`/dashboard/resume/${response.data.data.documentId}/edit`);
      } else {
        throw new Error('Server returned invalid response format');
      }
    } catch (error) {
      console.error('Resume creation error:', error);
      toast.error(error.response?.data?.error?.message || 'Failed to create resume. Please try again.');
    } finally {
      setLoading(false);
      setResumeTitle('');
      setOpenDialog(false);
    }
  };

  if (asButton) {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOpenDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus size={18} />
          <span>Create Resume</span>
        </motion.button>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="sm:max-w-md bg-white rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-gray-800">
                New Resume
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Start with a descriptive title
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <Input
                placeholder="e.g. Senior Developer Resume"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="focus-visible:ring-emerald-500"
                maxLength={50}
                disabled={loading}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateResume()}
              />
              <p className="text-xs text-gray-500 mt-1">
                {resumeTitle.length}/50 characters
              </p>
            </div>
            <DialogFooter className="mt-4 gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                onClick={() => setOpenDialog(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateResume}
                disabled={!resumeTitle.trim() || loading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating...
                  </>
                ) : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <motion.div 
      className={`relative overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer ${className}`}
      onClick={() => setOpenDialog(true)}
      whileHover={{ scale: 1.02 }}
    >
      <div className="h-full w-full flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <Plus className="text-emerald-600" size={24} />
        </div>
        <h3 className="text-sm font-medium text-gray-700">Add New Resume</h3>
      </div>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md bg-white rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-800">
              New Resume
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Start with a descriptive title
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Input
              placeholder="e.g. Senior Developer Resume"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              className="focus-visible:ring-emerald-500"
              maxLength={50}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              {resumeTitle.length}/50 characters
            </p>
          </div>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setOpenDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateResume}
              disabled={!resumeTitle.trim() || loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default AddResume;