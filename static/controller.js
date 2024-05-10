/******************************************************************************************
 *Author: Aleksandar Djuric
 *Email: aleksandar.djuriic@gmail.com
 *Created: 2024-03-13
 *Last Modified: 2024-04-05
 ******************************************************************************************
 * Description: This script is used to control the robot with keyboard and mouse.
 *
 * It sends commands to the Flask server to control the robot.
 * The script also includes a function to send PWM changes to the server.
 */

/******************************************************************************************
 * Function to send commands to the Flask server
 * The command is sent as a POST request to the "/command" route
 *  with the command and PWM value as parameters
 * The command is one of "F", "B", "L", "R", "E" or "A"
 * The PWM value is a number between 0 and 100
 * The server will interpret the command and send it over UART.
 ******************************************************************************************
 */

function sendCommand(command) {
  const pwmValue = document.getElementById("pwmSlider").value; // Get the PWM value from the slider
  fetch("/command", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `command=${command}&pwm=${pwmValue}`,
  });
}

// Function to send PWM change to Flask (optional if you want to update PWM immediately on change)
function sendPWM(value) {
  fetch("/pwm", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `pwm=${value}`,
  });
}

// Event listener for your PWM slider
document
  .getElementById("pwmSlider")
  .addEventListener("change", (event) => sendPWM(event.target.value));

/******************************************************************************************
 *                                      Mouse control
 *
 * Command buttons configuration and event listeners
 * Each button will have a mousedown event listener to start sending the corresponding command
 * and a mouseup event listener to stop sending the command
 * The command will be sent repeatedly while the button is pressed
 * The "E" command will be sent to stop the robot when the button is released
 *
 ******************************************************************************************
 */

// Global variable to keep track of the interval
let commandInterval = null;

const buttons = [
  { id: "keyboard_key_up", command: "F" },
  { id: "keyboard_key_down", command: "B" },
  { id: "keyboard_key_left", command: "L" },
  { id: "keyboard_key_right", command: "R" },
  { id: "emergency_button", command: "E" },
  { id: "automatic_button", command: "A" },
];

// This object will store the interval IDs for each button, allowing us to have separate intervals for each one
const commandIntervals = {};

function startSendingCommand(command, buttonId) {
  // Clear any existing interval to prevent overlaps
  if (commandIntervals[buttonId]) {
    clearInterval(commandIntervals[buttonId]);
  }

  // Start a new interval to continuously send the command
  commandIntervals[buttonId] = setInterval(() => {
    sendCommand(command);
  }, 100); // Adjust the interval time as needed, 100ms as an example
}

function stopSendingCommand(buttonId) {
  // Clear the interval when the mouse button is released
  if (commandIntervals[buttonId]) {
    clearInterval(commandIntervals[buttonId]);
    commandIntervals[buttonId] = null;
  }
  // Send the "E" command to stop
  sendCommand("E");
}

buttons.forEach((button) => {
  const element = document.getElementById(button.id);

  // Start sending commands on mousedown
  element.addEventListener("mousedown", () =>
    startSendingCommand(button.command, button.id)
  );

  // Stop sending commands and send "E" on mouseup
  element.addEventListener("mouseup", () => stopSendingCommand(button.id));

  // Consider adding a mouseleave event listener to handle the case where the mouse is moved away from the button while pressed
  element.addEventListener("mouseleave", () => stopSendingCommand(button.id));
});

/*****************************************************************************************
 *                                 Keyboard control
 * Event listener for keydown and keyup events to control the robot with the keyboard
 * The keys "w", "s", "a", "d" are used for forward, backward, left, and right respectively
 * The arrow keys can also be used for the same purpose
 * The "e" key is used to stop the robot
 * The "f" key is used to toggle automatic mode
 *
 ******************************************************************************************
 */

// Handling the keydown event for controlling the robot with keyboard
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "w":
    case "ArrowUp":
      sendCommand("F");
      break;
    case "s":
    case "ArrowDown":
      sendCommand("B");
      break;
    case "a":
    case "ArrowLeft":
      sendCommand("L");
      break;
    case "d":
    case "ArrowRight":
      sendCommand("R");
      break;
    case "e":
      sendCommand("E");
      break;
    case "f": // Automatic mode
      sendCommand("A"); //TODO: We need to decide what keys to use for automatic mode
      break;
  }
});

// Adding the mouseup event to stop the robot for each control button, assuming that's the intended behavior
[
  "keyboard_key_up",
  "keyboard_key_down",
  "keyboard_key_left",
  "keyboard_key_right",
  "emergency_button",
  "automatic_button",
].forEach((buttonId) => {
  document
    .getElementById(buttonId)
    .addEventListener("mouseup", () => sendCommand("E"));
});

// Handling the keyup event for stopping the robot with keyboard
document.addEventListener("keyup", () => {
  sendCommand("E");
});
