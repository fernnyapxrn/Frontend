<script setup>
import { ref } from 'vue';
import { url } from "../composable/fetchAPI.js"; 
import { useRouter } from 'vue-router';

const enteredUsername = ref('');
const enteredPassword = ref('');
const annStatus = ref('');
const router = useRouter();

const login = async () => {
    const username = enteredUsername.value;
    const password = enteredPassword.value;

    try {
        const response = await fetch(`${url}/api/token`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.status === 200) {
            const resData = await response.json();
            localStorage.setItem('token', resData.token);
            localStorage.setItem('refreshToken', resData.refreshToken);
            localStorage.setItem('username', username);
            annStatus.value = 'Login Successful';

            setTimeout(() => {
                router.push({ name: 'HomePage' });
            }, 1000);
        } else if (response.status === 401) {
            annStatus.value = 'Password Incorrect';
        } else if (response.status === 404) {
            annStatus.value = 'User not found'; 
        } else {
            const errorData = await response.json();
            annStatus.value = errorData.message;
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
</script>

<template>
    <div class=" w-screen h-screen " >
        <div class="page" style="background-color:#4ba470;">
            <div class="flex flex-col w-1/3 h-2/3  space-y-4">

                <div v-if="annStatus"
                    :class="{ 'bg-green-300  text-green-700': annStatus === 'Login Successful', 'bg-red-300  text-red-700': annStatus === 'User not found' || annStatus === 'Password Incorrect' }"
                    class="ann-status">
                    <div class="ann-message">{{ annStatus }}</div>
                </div>

                <div class="login-block">
                    <div class="header">
                        <p>SAS Login</p>
                    </div>
                    <div class="flex flex-col w-11/12 h-1/5 space-y-2 ">
                        <p>Username</p>
                        <input v-model="enteredUsername"
                            class="ann-username placeholder:italic placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                            maxlength="45" type="text" />
                    </div>
                    <div class="flex flex-col w-11/12 h-1/5 space-y-2 ">
                        <p>Password</p>
                        <input v-model="enteredPassword"
                            class="ann-username placeholder:italic placeholder:text-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
                            maxlength="45" type="password" />
                    </div>
                    <div class="button-position space-y-2">
                        <button @click="login()" class="button">LOGIN</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.page {
    display: flex;
    width: 100%;
    height: 100%;
    background-color: white;
    justify-content: center;
    align-items: center;
}

.ann-status {
    display: flex;
    width: 100%;
    height: 3.5rem;
    border-radius: 0.5rem;
    justify-content: center;
    align-items: center
}

.login-block {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 83.3333%;
    border-radius: 0.5rem;
    border: 1px solid #ccc;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.3);
    background-color: #fff;
    align-items: center;
}


.header {
    display: flex;
    width: 100%;
    height: 25%;
    justify-content: center;
    align-items: center;
    font-size: 30px;
}

p {
    font-weight: bold;

    color: #000;

}

.ann-username {
    color: #000;

    background-color: #fff;
    width: 100%;
    border: 1px solid #cbd5e0;
    border-radius: 0.375rem;
    padding: 0.5rem 1rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    font-size: 0.875rem;
}

@media (max-width: 640px) {
    .ann-username {
        font-size: 0.75rem;
    }
}

.button-position {
    display: flex;
    width: 90%;
    height: 20%;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    
}
.button:hover{
   background-color: #12472e;
  border-color: #12472e;
  color: #ffffff;
}
.button {
    width: 100%;
    height: 50%;
    font-size: 1.125rem;
    font-weight: bold;
    color: #fff;
    background-color: #047857;
    transition: background-color 0.3s ease-out, border-color 0.3s ease-out;
    border-radius: 0.375rem;
}</style>