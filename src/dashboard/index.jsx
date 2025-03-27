import React, { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import { useUser } from '@clerk/clerk-react'
import GlobalApi from './../../service/GlobalApi';
import ResumeCardItem from './components/ResumeCardItem';
import { FiSearch, FiDownload, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';

function Dashboard() {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      GetResumesList();
    }
  }, [user]);

  const GetResumesList = () => {
    setLoading(true);
    GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress)
      .then(resp => {
        setResumeList(resp.data?.data || []);
      })
      .catch(error => {
        console.error("Error fetching resumes:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const filteredResumes = resumeList.filter(resume => {
    const resumeName = resume?.name || resume?.title || '';
    return resumeName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='mb-10 p-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>My Resume Portfolio</h1>
          <p className='text-gray-600'>Create and manage your professional resumes</p>
          
          {/* Search and Actions */}
          <div className='mt-6 flex flex-col sm:flex-row gap-4'>
            <div className='relative flex-grow max-w-md'>
              <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                placeholder='Search resumes...'
                className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/90'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className='flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm'>
              <FiDownload size={18} />
              <span>Export All</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className='p-6 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm'>
          {/* Loading State */}
          {loading && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {[1, 2, 3, 4].map((item) => (
                <div 
                  key={item} 
                  className='h-64 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse'
                />
              ))}
            </div>
          )}

          {/* Resumes Grid */}
          {!loading && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              <motion.div whileHover={{ scale: 1.03 }} className='h-full'>
                <AddResume className='h-full' />
              </motion.div>
              
              {filteredResumes.map((resume, index) => (
                <motion.div
                  key={resume.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  className='h-full'
                >
                  <ResumeCardItem 
                    resume={resume} 
                    refreshData={GetResumesList}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && resumeList.length === 0 && (
            <div className='text-center py-16 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300'>
              <div className='w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <FiPlus className='text-emerald-600 text-3xl' />
              </div>
              <h3 className='text-lg font-medium text-gray-800 mb-2'>No resumes yet</h3>
              <p className='text-gray-500 mb-6'>Create your first AI-powered resume to get started</p>
              <AddResume asButton />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard