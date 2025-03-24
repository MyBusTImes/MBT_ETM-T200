<template>
    <div class="top">
        <h3>Messages for: {{ username }}</h3>
    </div>
    <div class="who">
        <button style="margin-right: 5px;" :class="{ active: filter === 'to' }" @click="filter = 'to'">
            TO YOU
        </button>
        <button style="margin-left: 5px;" :class="{ active: filter === 'from' }" @click="filter = 'from'">
            FROM YOU
        </button>
    </div>
    <div v-if="filteredConversations.length" class="tripContainer">
      <div class="trip" v-for="conversation in filteredConversations" :key="conversation.conversation_id" @click="message(conversation.conversation_id)">
        <div class="headers">
          <h3>Time</h3>
          <h3>{{ toFrom }}</h3>
          <h3>Title</h3>
        </div>
        <br>
        <div class="data">
            <p class="message-time">{{ new Date(conversation.created_at).toLocaleTimeString([], {
                        day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
                    }) }}</p>
          <p class="message-from">{{ toFrom === 'To' ? conversation.to : conversation.From }}</p>
          <p class="message-title">Title: {{ conversation.title }}</p>
        </div>
      </div>
    </div>
    
    <div v-else>
        <p>No conversations found.</p>
    </div>
    <div class="overlay" @click="openMessage('close')">
        <div class="newMessage" @click.stop>
            <input type="text" name="to" id="to" v-model="newMessage.to" placeholder="To"><br>
            <input type="text" name="title" id="title" v-model="newMessage.title" placeholder="Title"><br>
            <input type="hidden" name="from" :value="username">
            <textarea name="message" id="message" v-model="newMessage.message" rows="10"
                placeholder="Enter your message"></textarea>
            <button class="sendMessage" @click="sendMessage()">SEND</button>
        </div>
    </div>
    <div class="buttons">
        <button class="optionBT" @click="navigateToOptions">BACK</button>
        <button class="issue" style="background-color: #004ab9; color: white; width: calc(50vw - 5px);" @click="openMessage('open')">NEW</button>
        <button class="startBT" style="width: 25vw;" @click="fetchConversations(username)">REFRESH</button>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: "DriverMessaging",
    data() {
        return {
            username: localStorage.getItem("username")?.trim(),
            conversations: [],
            filter: "to", // Default to 'to' filter
            toFrom: "To",
            newMessage: {
                to: "",
                message: "",
            },
        };
    },
    computed: {
        filteredConversations() {
            // Filter conversations based on the 'filter' property ('to' or 'from')
            return this.conversations.filter(convo => {
                let isMatch;
                let toFrom;
    
                if (this.filter === 'to') {
                    isMatch = convo.to?.trim() === this.username;
                    toFrom = "From";
                } else {
                    isMatch = convo.From?.trim() === this.username;
                    toFrom = "To";
                }
    
                this.toFrom = toFrom; // If this needs to be updated globally
                return isMatch; // Ensuring the function returns a boolean
            });
        },
    },
    created() {
        this.fetchConversations();
    },
    methods: {
        async fetchConversations() {
            try {
                // Fetch conversations where 'to' is the username and where 'From' is the username
                const responses = await Promise.all([
                    axios.get('https://api.mybustimes.cc/api/conversation/', { params: { format: 'json', to: this.username } }),
                    axios.get('https://api.mybustimes.cc/api/conversation/', { params: { format: 'json', From: this.username } }),
                ]);

                // Store data in localStorage for 'to' and 'from' conversations
                localStorage.setItem('UserToData', JSON.stringify(responses[0].data.results || []));
                localStorage.setItem('UserFromData', JSON.stringify(responses[1].data.results || []));

                // Combine 'to' and 'from' conversations into a single array
                const ToResponse = JSON.parse(localStorage.getItem("UserToData")) || [];
                const FromResponse = JSON.parse(localStorage.getItem("UserFromData")) || [];
                this.conversations = [...ToResponse, ...FromResponse];
            } catch (error) {
                console.error('Error fetching conversations:', error);
                alert('Failed to fetch conversations.');
            }
        },
        navigateToOptions() {
            this.$router.push({ path: "/optionsMenu" });
        },
        message(id) {
            localStorage.setItem("selectedMessage", id);
            this.$router.push({ path: "/message" });
        },
        openMessage(options) {
            const overlay = document.getElementsByClassName('overlay')[0];
            overlay.style.display = options === 'open' ? 'block' : 'none';
        },
        async sendMessage() {
            if (!this.newMessage.to || !this.newMessage.message || !this.newMessage.title) {
                alert("Please fill in all fields.");
                return;
            }

            const conversationData = {
                to: this.newMessage.to,
                From: this.username,
                title: this.newMessage.title
            };

            try {
                // Create a new conversation
                const conversationResponse = await axios.post("https://api.mybustimes.cc/api/conversation/", conversationData, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (conversationResponse.status === 201) {
                    const conversationId = conversationResponse.data.conversation_id;
                    const messageData = {
                        to_user: this.newMessage.to,
                        message: this.newMessage.message,
                        conversation_id: conversationId
                    };

                    // Send the message for the created conversation
                    const messageResponse = await axios.post("https://api.mybustimes.cc/api/messages/", messageData, {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    if (messageResponse.status === 201) {
                        alert("Message sent successfully.");
                        // Clear the form fields after successful message send
                        this.newMessage.to = "";
                        this.newMessage.title = "";
                        this.newMessage.message = "";
                        this.fetchConversations(); // Re-fetch conversations after sending the message
                    } else {
                        alert("Failed to send message.");
                    }
                } else {
                    alert("Failed to create conversation.");
                }
            } catch (error) {
                console.error('Error sending message:', error);
                alert("Failed to send message.");
            }
        }
    },
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

.who button.active {
    border-color: rgb(208, 149, 76);
    background: #feb75f;
}

.who button.active:hover {
    border-color: rgb(199, 143, 74);
    background: #db9e52;
}

.who {
    position: absolute;
    top: 50px;
    left: 10px;
    right: 10px;
}

.who button {
    width: calc(50% - 5px);
    height: 4vh;
    background: white;
    color: black;
    border: #d2d2d2 2.5px solid;
    border-radius: 2.5px;
}

.messages button p {
    font-size: 3vw;
}

.who button:hover {
    cursor: pointer;
    background: rgb(224, 224, 224);
    border: #d2d2d2 2.5px solid;
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

.tripContainer {
    width: 100vw;
    overflow-y: auto;
    position: fixed;
    left: 0;
    top: 10vh;
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

.startBT:hover {
    background-color: #0056b3;
}
</style>
