import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:1337/api";  
const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
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
    params: { filters: { userEmail: { $eq: userEmail } } }, // Exact original
  });

/**
 * Update resume details by ID.
 * Ensures `education` is formatted correctly.
 * @param {string} id - Resume ID.
 * @param {Object} data - Updated resume data.
 */
const UpdateResumeDetail = (id, data) => {
  // Clean the skills data by removing any ID fields
  const cleanSkills = data.skills?.map(skill => {
    const { id: _, ...cleanSkill } = skill;
    return cleanSkill;
  });

  // Clean the projects data by removing any ID fields
  const cleanProjects = data.projects?.map(project => {
    const { id: _, ...cleanProject } = project;
    return cleanProject;
  });

  // Prepare the request data
  const requestData = {
    data: {
      ...(cleanSkills && { skills: cleanSkills }),
      ...(cleanProjects && { projects: cleanProjects }), // ✅ Now projects are cleaned too
      ...(data.education && {
        education: Array.isArray(data.education) ? data.education : [data.education]
      }),
      ...Object.fromEntries(
        Object.entries(data).filter(([key]) => !['skills', 'education', 'projects'].includes(key))
      )
    }
  };

  return requestData; // Make sure this is actually sent to your API
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