import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const USER_SERVICE_BASE_URL = process.env.USER_SERVICE_URL;

export const getUserInformation = async (userId) => {
  try {
    const response = await axios.get(
      `${USER_SERVICE_BASE_URL}/users/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch sport details:", error.message);
    return null;
  }
};
