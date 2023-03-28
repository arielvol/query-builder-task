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
  getColumnNamesByTableName(tableName) {
    return apiClient.post('/tables/columns', {tableName})
  },

  getColumnData(tableName, columnName) {
    return apiClient.post('/tables/columns/data', {tableName, columnName})
  },

  getAllQueries(){
    return apiClient.get('/queries');
  },

  executeQuery(query) {
    return apiClient.post('/queries/run', {query})
  }
}
