import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5001/api", // TODO: for local testing mode
  withCredentials: true,
  headers: {
    Authorization: `${localStorage.getItem('token')}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});


export default {
  getAllTablesNames() {
    return apiClient.get("/tables");
  },
  getColumnNames(tableName) {
    return apiClient.post("/tables/columns", { tableName });
  },

  getColumnData(tableName, columnName) {
    return apiClient.post("/tables/columns/data", { tableName, columnName });
  },

  getQueries() {
    const userId = localStorage.getItem("userId") || "";
    return apiClient.get(`/queries/${userId}`);
  },

  executeQuery(query) {
    return apiClient.post("/queries/run", { query });
  },

  createQuery(query) {
    const userId = localStorage.getItem("userId") || "";
    return apiClient.post(`/queries/${userId}`, {
      name: query.name,
      body: query.body,
    });
  },

  updateQuery(query) {
    const userId = localStorage.getItem("userId") || "";
    const { id, ...rest } = query;
    rest.userId = userId;
    return apiClient.put(`/queries/${userId}/${id}`, rest);
  },

  deleteQuery(queryId) {
    const userId = localStorage.getItem("userId") || "";
    return apiClient.delete(`/queries/${userId}/${queryId}`);

  },
};
