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
    <div class="messages" v-if="filteredConversations.length">
        <div v-for="conversation in filteredConversations" :key="conversation.conversation_id">
            <button @click="message(conversation.conversation_id)">
                <div class="message-header">
                    <p class="message-time">{{ new Date(conversation.created_at).toLocaleTimeString([], {
                        day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
                    }) }}</p>
                    <p class="message-from">{{ conversation.From }}</p>
                </div>
                <p class="message-title">Title: {{ conversation.title }}</p>
            </button>
        </div>
    </div>
    <div v-else>
        <p>No conversations found.</p>
    </div>
    <div class="buttons">
        <button class="optionBT" @click="navigateToOptions">BACK</button>
    </div>
</template>

<script>
export default {
    name: "DriverMessaging",
    data() {
        return {
            username: localStorage.getItem("username")?.trim(),
            conversations: [],
            filter: "to",
        };
    },
    computed: {
        filteredConversations() {
            return this.conversations.filter((convo) =>
                this.filter === "to"
                    ? convo.to?.trim() === this.username
                    : convo.From?.trim() === this.username
            );
        },
    },
    created() {
        this.fetchConversations();
    },
    methods: {
        fetchConversations() {
            const ToResponse = JSON.parse(localStorage.getItem("UserToData")) || [];
            const FromResponse = JSON.parse(localStorage.getItem("UserFromData")) || [];
            this.conversations = [...ToResponse, ...FromResponse];
        },
        navigateToOptions() {
            this.$router.push({ path: "/optionsMenu" });
        },
        message(id) {
            localStorage.setItem("selectedMessage", id);
            console.log(id);
            this.$router.push({ path: "/message" });
        },
    },
};

</script>


<style scoped>
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

.messages {
    position: fixed;
    top: calc(4vh + 60px);
    left: 10px;
    right: 10px;
    width: calc(100% - 20px);
    height: 70vh;
    overflow-y: scroll;
}

.messages button {
    background: transparent;
    color: red;
    border: 1px 0px gray solid;
    border-color: #c8c8c8;
    border-style: solid;
    border-width: 2px 0;
    margin-bottom: -2px;
    width: 100%;
    text-align: left;
    display: flex;
    flex-direction: column;
    padding: 10px;
}

.messages button:hover {
    background-color: #e7e7e7;
    cursor: pointer;
}

.message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.message-time {
    text-align: left;
    position: relative;
    left: 0;
}

.message-from {
    text-align: right;
    position: relative;
    right: 0;
}

.message-title {
    text-align: left;
    margin-top: 10px;
    width: 100%;
}

.top {
    position: fixed;
    width: 100vw;
    background: black;
    left: 0;
    top: 0;
    color: white;
    text-align: left;
    height: 45px;
}

.top h3 {
    margin-top: 8px;
    margin-left: 10px;
}
</style>