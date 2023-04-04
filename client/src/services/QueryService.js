import { queryApiClient } from "src/common/axios";


export default {
  getAllTablesNames() {
    return queryApiClient.get("/tables");
  },
  getColumnNames(tableName) {
    return queryApiClient.post("/tables/columns", { tableName });
  },

  getColumnData(tableName, columnName) {
    return queryApiClient.post("/tables/columns/data", { tableName, columnName });
  },

  getQueries() {
    const userId = localStorage.getItem("userId") || "";
    return queryApiClient.get(`/queries/${userId}`);
  },

  executeQuery(query) {
    return queryApiClient.post("/queries/run", { query });
  },

  createQuery(query) {
    const userId = localStorage.getItem("userId") || "";
    return queryApiClient.post(`/queries/${userId}`, {
      name: query.name,
      body: query.body,
    });
  },

  updateQuery(query) {
    const userId = localStorage.getItem("userId") || "";
    const { id, ...rest } = query;
    rest.userId = userId;
    return queryApiClient.put(`/queries/${userId}/${id}`, rest);
  },

  deleteQuery(queryId) {
    const userId = localStorage.getItem("userId") || "";
    return queryApiClient.delete(`/queries/${userId}/${queryId}`);

  },

  exportQuery(queryId) {
    return queryApiClient.get(`/queries/export/${queryId}`);
  },

  importQuery(query) {
    const userId = localStorage.getItem("userId") || "";
    return queryApiClient.post(`/queries/import/${userId}`, query);
  },
};
