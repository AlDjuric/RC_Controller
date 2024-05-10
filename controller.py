"""
Author: Aleksandar Djuric
Email: aleksandar.djuriic@gmail.com
Created: 2024-04-05
Last Modified: 
Description:  Controller for the robot movement
"""

import UART_com as uc


def controller(command_recieved, pwm_recieved):

    command = command_recieved
    pwm = pwm_recieved

    turn_duty_cycle = int(pwm * 0.5)  # Half PWM for the turning side

    if command:
        # Movement logic as described before
        if command == "F":
            motor_data = [("FW", pwm), ("FW", pwm), ("FW", pwm), ("FW", pwm)]
        elif command == "B":
            motor_data = [("BW", pwm), ("BW", pwm), ("BW", pwm), ("BW", pwm)]
        elif command == "L":
            motor_data = [
                ("BW", turn_duty_cycle),  # Front left motor
                ("FW", pwm),  # Front right motor
                ("BW", turn_duty_cycle),  # Rear left motor
                ("FW", pwm),  # Rear right motor
            ]
        elif command == "R":
            motor_data = [
                ("FW", pwm),  # Front left motor
                ("BW", turn_duty_cycle),  # Front right motor
                ("FW", pwm),  # Rear left motor
                ("BW", turn_duty_cycle),  # Rear right motor
            ]
        elif command == "E":
            motor_data = [("BR", 0), ("BR", 0), ("BR", 0), ("BR", 0)]
        elif command == "A":
            motor_data = [("FW", 25), ("FW", 25), ("FW", 25), ("FW", 25)]
        else:
            return "Invalid command", 400

        uc.send_command(*motor_data)  # Pass the motor_data list as argument

    return "", 204  # No content to return
