<template>
    <div class="stops">
        <div class="stop">
            <span class="tag tag1" style="height: 5vh;">FROM</span>
            <button class="prev-button terminus"><</button>
                <span class="terminus">
                    <p>Name</p>
                </span>
            <button class="next-button terminus">></button>
        </div>
        <div class="stop">
            <span class="tag tag2" style="height: 5vh;">STOP</span>
            <button class="prev-button stop1"><</button>
                <span class="stop1">
                    <p>Name</p>
                </span>
            <button class="next-button stop1">></button>
        </div>
        <div class="stop">
            <span class="tag tag3" style="height: 5vh;">TO</span>
            <button class="prev-button terminus"><</button>
                <span class="terminus">
                    <p>Name</p>
                </span>
            <button class="next-button terminus">></button>
        </div>
    </div>
    <div class="ticketToIssue">
        <p>NO TICKETS TO ISSUE</p>
    </div>
    <div class="Zones">
        <button><</button>
        <span>Single</span>
        <span>Day</span>
        <span>Week</span>
        <span>Month</span>
        <span>Year</span>
        <span>Other</span>
        <button>></button>
    </div>
    <div class="tickets">
        <div class="ticket">
            <p>£2.00</p>
            <button>-</button>
            <div class="count">
                <p>0</p>
            </div>
            <button>+</button>
            <p>AD SG Capped</p>
        </div>
        <div class="ticket">
            <p>£2.00</p>
            <button>-</button>
            <div class="count">
                <p>0</p>
            </div>
            <button>+</button>
            <p>AD SG Capped</p>
        </div>
        <div class="ticket">
            <p>£2.00</p>
            <button>-</button>
            <div class="count">
                <p>0</p>
            </div>
            <button>+</button>
            <p>AD SG Capped</p>
        </div>
        <div class="ticket">
            <p>£2.00</p>
            <button>-</button>
            <div class="count">
                <p>0</p>
            </div>
            <button>+</button>
            <p>AD SG Capped</p>
        </div>
        <div class="ticket">
            <p>£2.00</p>
            <button>-</button>
            <div class="count">
                <p>0</p>
            </div>
            <button>+</button>
            <p>AD SG Capped</p>
        </div>
        <div class="ticket">
            <p>£2.00</p>
            <button>-</button>
            <div class="count">
                <p>0</p>
            </div>
            <button>+</button>
            <p>AD SG Capped</p>
        </div>
    </div>
    <div class="buttons">
        <button class="optionBT">OPTIONS</button>
        <button class="issue">READY</button>
    </div>
</template>

<style>
.tickets {
    display: grid;
    grid-template-columns: repeat(2, 6fr);
    gap: 5px;
    position: fixed;
    width: calc(100vw - 20px);
    left: 10px;
    right: 10px;
    top: 22.5vh;
    bottom: calc(18vh + 10px);
    font-size: 2vh;
}

.ticket {
    border: 1px solid #000000;
    text-align: center;
    background-color: #c5c2c5;
}

.ticket .count {
  display: inline-block;
  margin: -10px 20px;
  border: 1px black solid;
  width: 30%;
}

.ticket button {
    display: inline-block;
    vertical-align: middle;
    background-color: transparent;
    color: black;
    font-size: 2vh;
}

.buttons {
  position: fixed;
  bottom: calc(10vh + 5px);
  left: 0;
  right: 0;
  height: 7.5vh;
}

.optionBT {
  position: fixed;
  left: 0;
  width: calc(25vw - 5px);
  height: 7.5vh;
  font-size: 2.5vh;
}

.issue {
  background: #c5c2c5;
  color: #9d9c9d;
  font-size: 2.5vh;
  position: fixed;
  width: 50vw;
  left: 25vw;
  height: 7.5vh;
}

.prev-button{
    margin-left: 20px;
}

.tag{
    position: fixed;
    left: 5px;
    background-color: #c5c2c5;
    color: black;
    text-orientation: mixed;
    text-align: left;
    writing-mode: vertical-rl;
    font-size: 90%;
    transform: rotate(180deg);
}

.tag1 {
    top: 5px;
}

.tag2 {
    top: calc(5vh + 10px);
}

.tag3 {
    top: calc(10vh + 15px);
}

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
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 5vh;
}

.stop button {
    width: 5%;
    height: 100%;
}

.stop span {
    margin: 0 5px;
    flex-grow: 1;
    height: 100%;
}

.stop p {
    font-size: 100%;
    text-align: center;
    color: white;
    margin-top: 15px;
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
