<template>
    <div>
        <div class="top">
            <h3>Message {{ to }}</h3>
        </div><br><br><br>
        <div class="buttons">
            <button class="optionBT" @click="navigateToOptions">BACK</button>
            <button class="issue" style="background-color: #004ab9; color: white; width: calc(50vw - 5px);"
                @click="openMessage('open')">NEW</button>
        </div>

        <!-- Display messages -->
        <div v-if="messages.length" class="tripContainerNew">
            <div v-for="message in messages" :key="message.message_id" class="trip">
                <div class="headers">
                    <h3>To</h3>
                    <h3 style="text-align: right;">Read</h3>
                </div>
                <div class="data">
                    <p>{{ message.to_user }}</p>
                    <p style="text-align: right;">{{ message.read ? 'Yes' : 'No' }}</p>
                </div>
                <div class="headers">
                    <h3>Message</h3>
                </div>
                <div class="data">
                    <p class="Msg">{{ message.message }}</p>
                </div>
            </div>
        </div>

        <div v-else>
            <p>No messages found. {{ conversationId }}</p>
        </div>
        <div class="overlay" @click="openMessage('close')">
            <div class="newMessage" @click.stop>
                <textarea v-model="newMessage" placeholder="Write your message..." rows="4" cols="100"></textarea>
                <button class="sendMessage" @click="sendMessage">SEND</button>
            </div>
        </div>
    </div>
</template>

<script>
// Import axios to make the API call
import axios from 'axios';

export default {
    name: 'DriverMessaging',
    data() {
        return {
            username: localStorage.getItem("username")?.trim(),
            messages: [],
            to: '',
            to_user: '',
            newMessage: '',  // To store the user input
            messagePerson: '', // To store the recipient's name
            conversationId: '',
            interval: null,  // Store the interval ID
        };
    },
    created() {
        // Call the API when the component is created
        this.fetchMessages();
    },
    mounted() {
        // Store the interval ID
        this.interval = setInterval(this.fetchMessages, 5000);
    },
    beforeUnmount() {
        // Clear the interval when the component is unmounted
        if (this.interval) {
            clearInterval(this.interval);
        }
    },
    beforeRouteLeave(to, from, next) {
        // Clear the interval before leaving the route
        if (this.interval) {
            clearInterval(this.interval);
        }
        next();  // Allow the navigation to proceed
    },
    methods: {
        async fetchMessages() {
            try {
                const conversationId = localStorage.getItem("selectedMessage"); // Get selected conversation ID from localStorage

                if (conversationId) {
                    const response = await axios.get(
                        `https://api.mybustimes.cc/api/messages/?conversation_id=${conversationId}&format=json`
                    );

                    // Save the result in the messages array
                    this.messages = response.data.results;

                    const response1 = await axios.get(
                        `https://api.mybustimes.cc/api/conversation/?conversation_id=${conversationId}&format=json`
                    );
                    this.conversationId = conversationId;
                    this.conversation = response1.data.results;
                    if (this.conversation[0].From === this.username) {
                        this.to = 'to ' + this.conversation[0].to;
                        this.to_user = this.conversation[0].to;
                    } else {
                        this.to = 'from ' + this.conversation[0].From;
                        this.to_user = this.conversation[0].From;
                    }

                    // Mark messages as read
                    this.markMessagesAsRead();
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        },

        async markMessagesAsRead() {
            try {
                // Fetch the messages
                const response = await axios.get(
                    `https://api.mybustimes.cc/api/messages/?conversation_id=${this.conversationId}&to_user=${this.username}`,
                    { params: { format: 'json' } }
                );

                // Check if there are any messages
                if (response.data.count === 0) {
                    console.log("No messages found.");
                    return;
                }

                // Filter messages where the to_user is the correct user and they are unread
                const messagesToMark = response.data.results.filter(
                    (message) => message.to_user === this.username && !message.read // Only unread messages
                );

                // Loop through the filtered messages and mark them as read
                for (const message of messagesToMark) {
                    await axios.patch(
                        `https://api.mybustimes.cc/api/messages/${message.message_id}/?conversation_id=${this.conversationId}&to_user=${this.username}`,
                        { read: true },
                        { params: { format: 'json' } }
                    );
                    console.log(`Message ${message.message_id} marked as read`);
                }

                // If no messages were marked as read
                if (messagesToMark.length === 0) {
                    console.log("No unread messages to mark as read.");
                }
            } catch (error) {
                console.error("Error marking messages as read:", error);
            }
        },

        openMessage(options) {
            const overlay = document.getElementsByClassName('overlay')[0];
            overlay.style.display = options === 'open' ? 'block' : 'none';
        },

        async sendMessage() {
            const conversationId = localStorage.getItem("selectedMessage"); // Get selected conversation ID from localStorage
            const messageText = this.newMessage; // Assuming you have a user input field for the message
            const toUser = this.to_user; // Get the recipient's name

            try {
                const response = await axios.post(
                    `https://api.mybustimes.cc/api/messages/`,
                    {
                        conversation_id: conversationId,
                        message: messageText,
                        to_user: toUser,
                    },
                    {
                        params: {
                            format: 'json'
                        }
                    }
                );
                console.log("Message sent successfully:", response.data);
                window.location.reload();
            } catch (error) {
                console.error("Error sending message:", error);
            }
        },

        navigateToOptions() {
            clearInterval(this.interval);  // Clear the interval before navigating away
            this.$router.push({ path: '/messageSection' });
        }
    }
};
</script>

<style scoped>
.sendMessage {
    background: #004ab9;
    color: #ffffff;
    font-size: 2.5vh;
    width: calc(100% - 8px);
    left: 25vw;
    height: 7.5vh;
}

.newMessage {
    padding: 3.5px 0;
    position: fixed;
    top: 20vh;
    width: 75vw;
    left: 12.5vw;
    background: white;
    z-index: 1002;
}

.newMessage input,
.newMessage textarea {
    width: calc(100% - 30px);
    padding: 10px;
    border: 1px solid;
}

.newMessage input::placeholder,
.newMessage textarea::placeholder {
    color: rgba(0, 0, 0, 0.5);
}


.overlay {
    display: none;
    background-color: rgba(0, 0, 0, 0.35);
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 1001;
}

.headers {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.headers h3 {
    margin: 0;
    padding: 5px;
    flex: 1;
    text-align: left;
    font-size: 3vw;
}

.data {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.data p {
    margin: 0;
    padding: 5px;
    flex: 1;
    text-align: left;
    font-weight: bold;
    font-size: 2.5vw;
}

.tripContainerNew {
    width: 100vw;
    overflow-y: auto;
    position: fixed;
    left: 0;
    top: 4vh;
    bottom: 20vh;
}

.trip:hover {
    background-color: #ffce73;
}

.trip {
    margin-bottom: -2.5px;
    background-color: #e6ebff;
    border-bottom: 2.5px solid gray;
    border-top: 2.5px solid gray;
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.trip .headers,
.trip .data {
    width: 100%;
}

p {
    text-align: left;
    font-size: 1rem;
    color: #555;
}
</style>
