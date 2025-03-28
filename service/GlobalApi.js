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

  // Prepare the request data
  const requestData = {
    data: {
      ...(cleanSkills && { skills: cleanSkills }),
      // Handle education if present
      ...(data.education && {
        education: Array.isArray(data.education) ? data.education : [data.education]
      }),
      // Include other fields
      ...Object.fromEntries(
        Object.entries(data).filter(([key]) => !['skills', 'education'].includes(key))
    )}
  };

  console.log("Final request payload:", JSON.stringify(requestData, null, 2));

  return axiosClient.put(`/user-resumes/${id}`, requestData);
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