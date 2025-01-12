<template>
    <div class="stops">
        <div class="stop">
            <button class="prev-button terminus"><</button>
                <span class="terminus">
                    <p>Name</p>
                </span>
            <button class="next-button terminus">></button>
        </div>
        <div class="stop">
            <button class="prev-button stop1"><</button>
                <span class="stop1">
                    <p>Name</p>
                </span>
            <button class="next-button stop1">></button>
        </div>
        <div class="stop">
            <button class="prev-button terminus"><</button>
                <span class="terminus">
                    <p>Name</p>
                </span>
            <button class="next-button terminus">></button>
        </div>
    </div>
</template>

<style>
.stops {
    position: fixed;
    top: 5px;
    left: 5px;
    right: 5px;
    z-index: 1000;
    /* Ensures it stays on top of other content */
}

.stop {
    margin-bottom: 5px;
    display: flex;
    /* Flexbox for layout */
    align-items: center;
    /* Vertically center the content */
    justify-content: space-between;
    /* Space out the buttons and span */
    width: 100%;
    height: 4vh;
    /* You might want to adjust this for better responsiveness */
}

.stop button {
    width: 5%;
    /* Fixed width for buttons */
    height: 100%;
}

.stop span {
    margin: 0 5px;
    flex-grow: 1;
    /* Ensures the span takes up the remaining space */
    height: 100%;
    font-size: 100%;
    color: white;
    text-align: center;
    /* Center the text */
}

.stop p {
    margin-top: 10px;
}

.terminus {
    background-color: #103963;
}

.terminus:hover {
    background-color: #0b2846;
}

.stop1 {
    background-color: #2965a5;
}

.stop1:hover {
    background-color: #1f4b7a;
}
</style>
