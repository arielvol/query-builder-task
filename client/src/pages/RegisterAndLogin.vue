<template>
    <q-page class="login-page">
        <q-card class="login-card">
            <q-card-section class="login-form-section">
                <q-form v-if="!loggedIn" class="login-form" @submit="login">
                    <q-input v-model="loginData.username" label="Username" type="text" required />
                    <q-input v-model="loginData.password" label="Password" type="password" required />
                    <q-btn type="submit" label="Login" color="primary" class="login-button" />
                </q-form>
                <q-form v-if="!loggedIn" class="register-form" @submit="register">
                    <q-input v-model="registerData.username" label="Username" type="text" required />
                    <q-input v-model="registerData.password" label="Password" type="password" required />
                    <q-btn type="submit" label="Register" color="primary" class="register-button" />
                </q-form>
                <div v-else class="success-message">
                    <div class="message">{{ successMessage }}</div>
                    <q-btn type="button" label="Logout" color="primary" class="logout-button" @click="logout" />
                </div>
            </q-card-section>
            <q-card-actions>
                <q-btn v-if="!loggedIn" type="button" label="Register" color="primary" class="register-link"
                    @click="showRegister" />
                <q-btn v-else type="button" label="Profile" color="primary" class="profile-link" @click="showProfile" />
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
// import { QPage, QCard, QCardSection, QForm, QInput, QBtn, QCardActions } from 'quasar'

const loggedIn = ref(false)
const username = ref('')
const token = ref(localStorage.getItem('token') || '')

const loginData = ref({
    username: '',
    password: ''
})

const registerData = ref({
    username: '',
    password: ''
})

const error = ref('')
const successMessage = ref('')

function login() {
    axios.post('/api/login', {
        username: loginData.value.username,
        password: loginData.value.password
    }).then(response => {
        // Store the token in local storage
        localStorage.setItem('token', response.data.token)

        // Set the token in the component state
        token.value = response.data.token

        // Set the username in the component state
        username.value = loginData.value.username

        // Set the loggedIn flag to true
        loggedIn.value = true

        // Clear the login and register forms
        loginData.value.username = ''
        loginData.value.password = ''
        registerData.value.username = ''
        registerData.value.password = ''

        // Clear any error messages
        error.value = ''
        successMessage.value = 'Logged in successfully!'
    }).catch(err => {
        // Display an error message
        error.value = err.response.data.message
        successMessage.value = ''
    })
}

function register() {
    axios.post('/api/register', {
        username: registerData.value.username,
        password: registerData.value.password
    })
        .then(response => {
            // Clear the register form
            registerData.value.username = ''
            registerData.value.password = ''
            // Display a success message
            successMessage.value = 'Registered successfully!'
            error.value = ''
        })
        .catch(err => {
            // Display an error message
            error.value = err.response.data.message
            successMessage.value = ''
        })
}

function logout() {
    // Remove the token from local storage
    localStorage.removeItem('token')

    // Set the token in the component state to an empty string
    token.value = ''

    // Set the loggedIn flag to false
    loggedIn.value = false

    // Clear the username
    username.value = ''
}

function showRegister() {
    loggedIn.value = false
}

function showProfile() {
    // Do something to show the user's profile
}

// Check if a token is present in local storage
if (token.value) {
    axios.post('/api/verify', { token: token.value })
        .then(response => {
            // Set the username in the component state
            username.value = response.data.username

            // Set the loggedIn flag to true
            loggedIn.value = true
        })
        .catch(err => {
            // Remove the invalid token from local storage
            localStorage.removeItem('token')

            // Set the token in the component state to an empty string
            token.value = ''
        })
}

</script >

<style scoped>
.login-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.login-card {
    max-width: 500px;
    width: 100%;
}

.login-form {
    display: flex;
    flex-direction: column;
    margin-bottom: 16px;
}

.login-form-section {
    padding: 16px;
}

.login-button {
    margin-top: 16px;
}

.register-button {
    margin-top: 16px;
}

.logout-button {
    margin-top: 16px;
}

.success-message {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
}

.message {
    margin-bottom: 16px;
}

.register-form {
    display: none;
}

.register-link {
    margin-left: auto;
}

.profile-link {
    margin-left: auto;
}
</style>