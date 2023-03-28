import axios from 'axios'

const apiClient = axios.create({
  //baseURL: 'http://localhost:5001/api/employees',  TODO: for local testing mode
  baseURL: '/api/employees',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getAllEmployees() {
    return apiClient.get();
  },
  getEmployeeById(employeeId) {
    return apiClient.get('/' + employeeId);
  },
  createEmployee(employee) {
    return apiClient.post('', employee);
  },
  updateEmployee(employee) {
    const id = employee.id;
    delete employee.id; //TODO: not a good practice , better to re-copy without the property
    return apiClient.put('/' +  id, employee);
  },
  deleteEmployee(employeeId) {
    return apiClient.delete('/' +  employeeId);
  }
}
