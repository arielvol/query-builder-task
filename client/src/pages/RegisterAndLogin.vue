<template>
    <q-page class="login-page">
        <q-card class="login-card">
            <q-card-section class="login-form-section">
                <q-form v-if="!loggedIn" class="login-form" @submit="OnLoginClicked">
                    <q-input v-model="loginData.username" label="Username" type="text" required />
                    <q-input v-model="loginData.password" label="Password" type="password" required />
                    <q-btn type="submit" label="Login" color="primary" class="login-button" />
                    <div class="message-section">
                        <div class="message">{{ userMessage }}</div>
                    </div>
                </q-form>
            </q-card-section>
            <q-card-actions>
                <q-btn type="button" label="Register" color="primary" class="register-link" @click="OnRegisterClicked" />
            </q-card-actions>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref } from 'vue'
import LoginService from 'src/services/LoginService';
import { useRouter } from 'vue-router';
import jwtDecode from 'jwt-decode'
import toastr from 'toastr';
import 'toastr/toastr.scss';
import { createErrorMessage } from '../utils/utils';

const router = useRouter();
const loggedIn = ref(false)
const username = ref('')
const token = ref(localStorage.getItem('token') || '')

const loginData = ref({
    username: '',
    password: ''
})

const userMessage = ref('')

async function OnLoginClicked() {

    try {
        const response = await LoginService.login(loginData.value.username, loginData.value.password)

        //Save the token in the local storage
        localStorage.setItem('token', response.data.token)

        const decodedToken = jwtDecode(response.data.token);
        const userId = decodedToken.id

        //Save the user Id in the local storage
        localStorage.setItem('userId', userId)

        token.value = response.data.token
        username.value = loginData.value.username

        loginData.value.username = ''
        loginData.value.password = ''
        router.push({ name: 'builder' })
    } catch (err) {
        const message = createErrorMessage(err);
        toastr.error(message, "Login Failed");
        userMessage.value = ''
    }
}

async function OnRegisterClicked() {

    try {
        if (loginData.value.username && loginData.value.password) {
            await LoginService.register(loginData.value.username, loginData.value.password)
            toastr.success(`User ${loginData.value.username} was successfully registered`);
            loginData.value.username = ''
            loginData.value.password = ''
            userMessage.value = 'Registered successfully! Please login now.'
        } else {
            userMessage.value = 'Both username and password are required.'
        }
    } catch (err) {
        const message = createErrorMessage(err);
        toastr.error(message, "Register Failed");
        userMessage.value = ''
    }
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

.message-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
}

.message {
    margin-bottom: 16px;
}

.register-link {
    margin-left: auto;
}
</style>