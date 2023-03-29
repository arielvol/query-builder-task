import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api', // TODO: for local testing mode
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getAllTablesNames() {
    return apiClient.get('/tables');
  },
  getColumnNames(tableName) {
    return apiClient.post('/tables/columns', {tableName})
  },

  getColumnData(tableName, columnName) {
    return apiClient.post('/tables/columns/data', {tableName, columnName})
  },

  getQueries(){
    return apiClient.get('/queries');
  },

  executeQuery(query) {
    return apiClient.post('/queries/run', {query})
  },

  createQuery(query) {
    return apiClient.post('/queries', { name: query.name, body: query.body });
  },

  updateQuery(query) {
    const { id, ...rest } = query;
    return apiClient.put('/queries/' +  id, rest);
  },

  deleteQuery(queryId) {
    return apiClient.delete('/queries/' +  queryId);
  }
}
