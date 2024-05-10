"""
Author: Aleksandar Djuric
Email: aleksandar.djuriic@gmail.com
Created: 2024-04-05
Last Modified: 
Description:  UART communication 
"""

import serial

# ********************************************
# UART CONFIG
# ********************************************

serial_device = "/dev/ttyAMA0"  # Adjust based on  setup
baud_rate = 115200  # Adjust based on the setup
ser = serial.Serial(serial_device, baud_rate, timeout=1)


# ********************************************
#  COMMANDS to be sent to the STM32
# ********************************************
def control_message(device_id, password, motor_data):
    starting_bytes, ending_bytes = "[!", "!]"
    message = f"{starting_bytes}{device_id}{password}"

    for direction, duty_cycle in motor_data:
        # Ensure duty cycle is within 0 to 100 range and set to 0 for brakes
        duty_cycle = min(max(duty_cycle, 0), 100) if direction != "BR" else 0
        message += f"{direction}{str(duty_cycle).zfill(3)}"

    message += ending_bytes
    return message


def send_command(front_left, front_right, rear_left, rear_right):
    device_id = "01"  # Device ID
    password = "AFRY"  # Password for device authentication
    # Combine the motor data into a list of tuples
    motor_data = [front_left, front_right, rear_left, rear_right]

    # Create the control message using the control_message function
    full_message = control_message(device_id, password, motor_data)
    full_message += "\n"  # Newline character to indicate end of message

    # Send the message over UART
    print(
        f"Sending message: {full_message} "
    )  # Debug print, can be removed or logged appropriately
    ser.write(full_message.encode())  # Make sure ser is your serial connection object
