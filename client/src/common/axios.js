import axios from 'axios'

// export const registerApiClient = axios.create({
//   baseURL: 'http://localhost:5005/', // TODO: for local testing mode
//   withCredentials: false,
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json'
//   }
// })

// export const queryApiClient = axios.create({
//     baseURL: "http://localhost:5005/", // TODO: for local testing mode
//     withCredentials: true,
//     headers: {
//       Authorization: `${localStorage.getItem('token')}`,
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//   });



export const registerApiClient = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
      Authorization: `${localStorage.getItem('token')}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })

export const queryApiClient = axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
      Authorization: `${localStorage.getItem('token')}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })