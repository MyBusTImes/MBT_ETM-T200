<template>
    <div>
        <div class="buttons">
            <button class="optionBT" @click="navigateToOptions">BACK</button>
        </div>

        <!-- Display messages -->
        <div v-if="messages.length">
            <div v-for="message in messages" :key="message.message_id">
                <div class="message-container">
                    <p class="Read" style="text-align: right;margin-bottom: -25px;"><strong>Read:</strong> {{ message.read ? 'Yes' : 'No' }}</p>
                    <p class="To" style="text-align: left;"><strong>To:</strong> {{ message.to_user }}</p>
                    <p class="Msg" style="text-align: left;"><strong>Message:</strong> {{ message.message }}</p>
                </div>
            </div>
        </div>

        <div v-else>
            <p>No messages found. {{conversationId}}</p>
        </div>

        <!-- Form to send a message -->
        <div class="message-input">
            <input type="text" v-model="messagePerson" placeholder="To who...">
            <textarea v-model="newMessage" placeholder="Write your message..." rows="4" cols="50"></textarea>
            <button @click="sendMessage">Send Message</button>
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
            messages: [],
            newMessage: '',  // To store the user input
            messagePerson: '', // To store the recipient's name
        };
    },
    created() {
        // Call the API when the component is created
        this.fetchMessages();
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
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        },
        async sendMessage() {
            const conversationId = localStorage.getItem("selectedMessage"); // Get selected conversation ID from localStorage
            const messageText = this.newMessage; // Assuming you have a user input field for the message
            const toUser = this.messagePerson; // Get the recipient's name

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
            this.$router.push({ path: '/messageSection' });
        }
    }
};
</script>

<style scoped>
.message-container {
    padding: 10px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    border-radius: 5px;
}

.message-container p {
    margin: 5px 0;
}

.buttons {
    margin-top: 20px;
}

.message-input {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
}

.message-input textarea {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}

.message-input button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.message-input button:hover {
    background-color: #0056b3;
}
</style>
