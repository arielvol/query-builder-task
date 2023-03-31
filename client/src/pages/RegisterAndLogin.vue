<template>
    <q-page class="login-page">
        <q-card class="login-card">
            <q-card-section class="login-form-section">
                <q-form v-if="!loggedIn" class="login-form" @submit="OnLoginClicked">
                    <q-input v-model="loginData.username" label="Username" type="text" required />
                    <q-input v-model="loginData.password" label="Password" type="password" required />
                    <q-btn type="submit" label="Login" color="primary" class="login-button" />
                    <div class="success-message">
                        <div class="message">{{ successMessage }}</div>
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
import  {createErrorMessage} from '../utilities';

const router = useRouter();
const loggedIn = ref(false)
const username = ref('')
const token = ref(localStorage.getItem('token') || '')

const loginData = ref({
    username: '',
    password: ''
})

const successMessage = ref('')

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
        successMessage.value = ''
    }
}

async function OnRegisterClicked() {

    try {
        await LoginService.register(loginData.value.username, loginData.value.password)

        loginData.value.username = ''
        loginData.value.password = ''
        successMessage.value = 'Registered successfully! Please login now.'
    } catch (err) {
        const message = createErrorMessage(err);
        toastr.error(message, "Register Failed");
        successMessage.value = ''
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

.register-link {
    margin-left: auto;
}
</style>