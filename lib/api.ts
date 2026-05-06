import axios from "axios";

const apiHandler = axios.create({
  baseURL: "/api", // all requests will use this prefix
  // headers: {
  //   "Content-Type": "application/json",
  // },
  withCredentials: true, // important for cookies (JWT)
});

export default apiHandler;
