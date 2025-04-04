import axios from "axios";

// Corrected environment variable names
const API_BASE_URL = import.meta.env.VITE_BASE_URL; // Ensure correct usage
const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;

// Debugging logs to check if environment variables are loaded correctly

// Create Axios client
const axiosClient = axios.create({
  baseURL: `${API_BASE_URL}/api/`, // Restored correct API URL format from old code
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
  timeout: 30000, // Increased timeout for network stability
});

// Enhanced error handling
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// CRUD API Methods

/**
 * Create a new resume.
 * @param {Object} data - Resume data.
 */
const CreateNewResume = (data) => axiosClient.post("/user-resumes", data);

/**
 * Get all resumes for a user by email.
 * @param {string} userEmail - User's email address.
 */
const GetUserResumes = (userEmail) =>
  axiosClient.get("/user-resumes", {
    params: {
      filters: { userEmail: { $eq: userEmail } },
      populate: [],
    },
  });

/**
 * Update resume details by ID.
 * @param {string} id - Resume ID.
 * @param {Object} data - Updated resume data.
 */
const UpdateResumeDetail = (id, data) => {
  const cleanSkills = data.skills?.map(({ id, ...skill }) => skill);
  const cleanProjects = data.projects?.map(({ id, ...project }) => project);

  const cleanEducation = data.education
    ?.map(({ universityName, degree, major, startDate, endDate, description }) => ({
      universityName: universityName || null,
      degree: degree || null,
      major: major || null,
      startDate: startDate || null,
      endDate: endDate || null,
      description: description || null,
    }))
    .filter((edu) => Object.values(edu).some((val) => val !== null));

  // Final data structure
  const requestData = {
    education: cleanEducation,
    ...(cleanSkills && { skills: cleanSkills }),
    ...(cleanProjects && { projects: cleanProjects }),
    ...Object.fromEntries(
      Object.entries(data).filter(([key]) => !["skills", "education", "projects"].includes(key))
    ),
  };

  console.log("📤 Sending Update Request:", requestData);

  return axiosClient
    .put(`/user-resumes/${id}`, { data: requestData }) // Restored correct endpoint
    .then((response) => {
      console.log("✅ Update Success:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("❌ Update Error:", error.response?.data || error.message);
      throw error;
    });
};

/**
 * Get resume details by ID.
 * @param {string} id - Resume ID.
 */
const GetResumeById = (id) => axiosClient.get(`/user-resumes/${id}`, { params: { populate: "*" } });

/**
 * Delete resume by ID.
 * @param {string} id - Resume ID.
 */
const DeleteResumeById = (id) => axiosClient.delete(`/user-resumes/${id}`);

// Export API functions
export default {
  CreateNewResume,
  GetUserResumes,
  UpdateResumeDetail,
  GetResumeById,
  DeleteResumeById,
};