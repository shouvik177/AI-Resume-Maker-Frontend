import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://shk-vts.onrender.com"; 
const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL+"/api/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
  timeout: 10000, // Added timeout but kept all other original config
});

// Enhanced error interceptor but same structure
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Create a new resume.
 * @param {Object} data - Resume data.
 */
const CreateNewResume = (data) => axiosClient.post("/user-resumes", data); // Maintained exact original

/**
 * Get all resumes for a user by email.
 * @param {string} userEmail - User's email address.
 */
const GetUserResumes = (userEmail) => 
  axiosClient.get(`/user-resumes`, {
    params: { 
      filters: { userEmail: { $eq: userEmail } },
      populate: []  // Empty array means no specific fields are populated
    },
  });

/**
 * Update resume details by ID.
 * Ensures `education` is formatted correctly.
 * @param {string} id - Resume ID.
 * @param {Object} data - Updated resume data.
 */

const UpdateResumeDetail = (id, data) => {
  const cleanSkills = data.skills?.map(skill => {
    const { id: _, ...cleanSkill } = skill;
    return cleanSkill;
  });

  const cleanProjects = data.projects?.map(project => {
    const { id: _, ...cleanProject } = project;
    return cleanProject;
  });
  console.log("h")

  const cleanEducation = data.education?.map(education => ({
    universityName: education.universityName || null,
    degree: education.degree || null,
    major: education.major || null,
    startDate: education.startDate || null,
    endDate: education.endDate || null,
    description: education.description || null
  })).filter(edu => 
    Object.values(edu).some(val => val !== null)
  );


  // Build CORRECT request data structure
  const requestData = {
    education: cleanEducation,
    ...(cleanSkills && { skills: cleanSkills }),
    ...(cleanProjects && { projects: cleanProjects }),
    ...Object.fromEntries(
      Object.entries(data).filter(([key]) => !['skills', 'education', 'projects'].includes(key))
    )
  };

  // Debugging Logs
  console.log("Final Processed Data Before API Call:", requestData);
  console.log("Full API Request Body:", JSON.stringify({ data: requestData }, null, 2));

  return axiosClient.put(`/user-resumes/${id}`, { data: requestData }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  })
  .then(response => {
    console.log("API Response:", response.data);
    return response.data;
  })
  .catch(error => {
    console.error("API Error Details:", {
      status: error.response?.status,
      error: error.response?.data?.error,
      message: error.message,
      requestData: error.config?.data // Log what was actually sent
    });
    throw error;
  });
};

/**
 * Get resume details by ID (including related data).
 * @param {string} id - Resume ID.
 */
const GetResumeById = (id) => axiosClient.get(`/user-resumes/${id}`, { params: { populate: "*" } }); // Original

/**
 * Delete resume by ID.
 * @param {string} id - Resume ID.
 */
const DeleteResumeById = (id) => axiosClient.delete(`/user-resumes/${id}`); // Original


// Export with original naming convention
export default {
  CreateNewResume,
  GetUserResumes,
  UpdateResumeDetail,
  GetResumeById,
  DeleteResumeById,
};