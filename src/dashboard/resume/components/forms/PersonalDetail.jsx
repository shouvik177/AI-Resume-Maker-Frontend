import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import { LoaderCircle } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import GlobalApi from './../../../../../service/GlobalApi'
import { toast } from 'sonner'

function PersonalDetail({ enabledNext }) {
  const params = useParams()
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    address: '',
    phone: '',
    email: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (resumeInfo) {
      setFormData({
        firstName: resumeInfo.firstName || '',
        lastName: resumeInfo.lastName || '',
        jobTitle: resumeInfo.jobTitle || '',
        address: resumeInfo.address || '',
        phone: resumeInfo.phone || '',
        email: resumeInfo.email || '',
        linkedinUrl: resumeInfo.linkedinUrl || '',
        githubUrl: resumeInfo.githubUrl || '',
        portfolioUrl: resumeInfo.portfolioUrl || ''
      })
    }
  }, [resumeInfo])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    enabledNext(false)
  }

  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!params?.resumeId) {
      toast.error("Invalid resume ID");
      setLoading(false);
      return;
    }
  
    const sanitizedData = {
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      jobTitle: formData.jobTitle || "",
      address: formData.address || "",
      phone: formData.phone || "",
      email: formData.email || "",
      linkedinUrl: formData.linkedinUrl || null,
      githubUrl: formData.githubUrl || null,
      portfolioUrl: formData.portfolioUrl || null,
    };
  
    try {
      const response = await GlobalApi.UpdateResumeDetail(params.resumeId, sanitizedData);
      
      // Updated success check - look for firstName or any required field
      if (response.data?.firstName) {  // Changed this line
        setResumeInfo(prev => ({
          ...prev,
          ...formData
        }));
        toast.success("Personal details updated successfully");
        enabledNext(true);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(
        error.response?.data?.error?.message || 
        "Failed to update details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-6 rounded-xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-800 mb-1'>Personal Information</h2>
        <p className='text-gray-500'>Complete your personal details to build your resume</p>
      </div>

      <form onSubmit={onSave}>
        <div className='space-y-5'>
          {/* Basic Information Section */}
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-semibold text-gray-700 mb-3 flex items-center'>
              <span className='w-2 h-2 bg-blue-500 rounded-full mr-2'></span>
              Basic Information
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>First Name*</label>
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className='bg-white focus:ring-2 focus:ring-blue-100'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Last Name*</label>
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className='bg-white focus:ring-2 focus:ring-blue-100'
                  required
                />
              </div>
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Job Title*</label>
                <Input
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  className='bg-white focus:ring-2 focus:ring-blue-100'
                  required
                />
              </div>
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Address*</label>
                <Input
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className='bg-white focus:ring-2 focus:ring-blue-100'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Phone*</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className='bg-white focus:ring-2 focus:ring-blue-100'
                  required
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Email*</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className='bg-white focus:ring-2 focus:ring-blue-100'
                  required
                />
              </div>
            </div>
          </div>

          {/* Online Profiles Section */}
          <div className='bg-gray-50 p-4 rounded-lg'>
            <h3 className='font-semibold text-gray-700 mb-3 flex items-center'>
              <span className='w-2 h-2 bg-blue-500 rounded-full mr-2'></span>
              Online Profiles (Optional)
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>LinkedIn URL</label>
                <Input
                  name="linkedinUrl"
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  className='bg-white focus:ring-2 focus:ring-blue-100'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>GitHub URL</label>
                <Input
                  name="githubUrl"
                  type="url"
                  placeholder="https://github.com/username"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  className='bg-white focus:ring-2 focus:ring-blue-100'
                />
              </div>
              <div className='md:col-span-2'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Portfolio URL</label>
                <Input
                  name="portfolioUrl"
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolioUrl}
                  onChange={handleInputChange}
                  className='bg-white focus:ring-2 focus:ring-blue-100'
                />
              </div>
            </div>
          </div>
        </div>

        <div className='mt-6 flex justify-end'>
          <Button 
            type="submit" 
            disabled={loading}
            className='px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md transition-all'
          >
            {loading ? (
              <>
                <LoaderCircle className='animate-spin mr-2' />
                Saving...
              </>
            ) : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default PersonalDetail