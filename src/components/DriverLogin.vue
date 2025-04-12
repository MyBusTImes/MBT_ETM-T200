<template>
    <div class="login-container">
        <div class="login-form">
            <input type="text" v-model="code" placeholder="Enter username" class="username-input" />
            <div class="button-grid">
                <button class=".buttonKey" v-for="button in buttons" :key="button" @click="handleButtonClick(button)">
                    {{ button }}
                </button>
                <a href="https://www.mybustimes.cc/BusTimes/gen_mbtt_code.php" target="_blank">Get Login Code</a>
            </div>
        </div>
    </div>
    <div>
        <!--<p>Username: {{ username }}</p>-->
    </div>
</template>
<script>
import axios from 'axios';


export default {
    name: 'DriverLogin',

    data() {
        return {
            username: '',
            code: '',  // The code to be submitted
            buttons: ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'],
        };
    },
    methods: {
        playSound() {
            const audio = new Audio(require('@/assets/Audio/Logon.wav'));
            audio.play();
        },
        async handleButtonClick(button) {
            if (button === 'C') {
                this.code = ''; // Clear the input field
            } else if (button === 'OK') {
                if (this.code) {
                    try {
                        // Make an API request with the submitted code
                        const response = await axios.get('https://api.mybustimes.cc/api/users/', {
                            params: {
                                code: this.code,
                                email: '',
                                expiry_datetime: '',
                                format: 'json',
                                id: '',
                                name: '',
                                pin: '',
                                username: '',
                            },
                        });
                        //console.log(response);  
                        // Set the username from the API response
                        const username = response.data.results[0].username || 'Username not found';
                        localStorage.setItem('username', username);
                        console.log('Username saved to local storage:', username);
                        this.redirect();
                    } catch (error) {
                        console.error('API request failed:', error);
                        const audio = new Audio(require('@/assets/Audio/Ticket decline.wav'));
                        audio.play();
                        //this.username = 'Error fetching username';
                    }
                } else {
                    alert('Please enter a code');
                }
            } else {
                this.code += button; // Append the button value to the input
            }
        },
        redirect() {
            this.playSound();
            setTimeout(() => {
                console.log('Redirecting...');
                this.$router.push({ path: '/LoadUserData' });
            }, 2000);
        },
    },
};
</script>

<style scoped>
.login-container {
    position: fixed;
    top: 10vh;
    left: 10vw;
    width: 80vw;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
}

.login-form {
    width: 100%;
    max-width: 500px;
    height: 60vh;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
}

.username-input {
    width: calc(100% - 25px);
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
}

.button-grid {
    height: 60vh;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    position: relative;
    bottom: 14vh;
    width: 100%;
    top: 5px;
    max-width: 500px;
}

.buttonKey {
    text-align: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-size: 16px;
    background-color: #004ab9;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.buttonKey:hover {
    background-color: #003c97;
}
</style>
