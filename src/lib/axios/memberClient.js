import axios from "axios";

const memberClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_MEMBER_API_BASE_URL,
});

export default memberClient;
