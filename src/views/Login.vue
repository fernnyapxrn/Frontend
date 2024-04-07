<script setup>
import {ref} from 'vue';
import { useRouter } from 'vue-router'

const enteredUsername = ref('');
const enteredPassword = ref('');
const annStatus = ref('');
const router = useRouter();

const login = async () => {
    const username = enteredUsername.value;
    const password = enteredPassword.value;


    const response = await fetch(import.meta.env.VITE_ROOT_API + "/api/token", {
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
        const res = await response.json()
        localStorage.setItem('token', res.token)
        localStorage.setItem('refreshToken', res.refreshToken)
        localStorage.setItem('username', username);
        annStatus.value = 'Login Successful';

        setTimeout(() => {
            router.push({ name: 'ListAllAnnouncement' })
    }, 3000);

    } else {
        const errorData = await response.json()
        if (errorData.status === 401) {
            annStatus.value = 'Password Incorrect';
        } else if (errorData.status === 404) {
            annStatus.value = 'A User with specified username DOES NOT exist';
        } 
        else {
            annStatus.value = errorData.message
        }
    }

}

</script>
 
<template>
    <div class=" w-screen h-screen">
        <div class="flex w-full h-full bg-white justify-center items-center">
            <div class="flex flex-col w-1/3 h-2/3  space-y-4">
                <div v-if="annStatus == 'Login Successful'" class="flex w-full h-16 bg-white justify-center items-center">
                    <img src="../components//icons/load.gif" alt="Loading..." class=" w-12 h-12" />
                </div>
                <div v-if="annStatus"
                    :class="{ 'bg-green-300 border-green-700 text-green-700': annStatus === 'Login Successful', 'bg-red-300 border-red-700 text-red-700': annStatus === 'A User with specified username DOES NOT exist' || annStatus === 'Password Incorrect' }"
                    class="ann-status flex w-full h-14  rounded-xl border justify-center items-center">
                 <div class="ann-message">{{ annStatus }}</div>
                </div>

                <div class="flex flex-col w-full h-5/6 items-center rounded-xl border border-gray-300 shadow-2xl bg-white">
                    <div class="flex w-full h-1/4 justify-center items-center ">
                        <p class="text-2xl font-bold text-black">SAS Login</p>
                    </div>
                    <div class="flex flex-col w-11/12 h-1/5 space-y-2 ">
                        <p class="font-bold text-black">Username</p>
                        <input v-model="enteredUsername"
                            class="ann-username text-black placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-4 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                            maxlength="45" type="text" />
                    </div>
                    <div class="flex flex-col w-11/12 h-1/5 space-y-2 ">
                        <p class="font-bold text-black">Password</p>
                        <input v-model="enteredPassword"
                            class="ann-username text-black placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-4 pr-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                            maxlength="45" type="password" />
                    </div>
                    <div class="flex w-full h-1/5 justify-center items-center mt-4">
                        <button @click="login()" class="w-11/12 h-1/2 text-lg font-bold text-white bg-blue-500 rounded-md">LOGIN</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
 
<style scoped></style>