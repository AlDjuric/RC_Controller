"""
Author: Aleksandar Djuric
Email: aleksandar.djuriic@gmail.com
Created: 2024-03-22
Last Modified: 2024-03-22
Description: Monitoring WiFi signal strength on a Raspberry Pi and display warnings
"""

import subprocess
import re


def get_wireless_interface():
    """
    Find the wireless network interface, usually starts with 'wlan'.
    :return: The wireless interface name or None if not found.
    """
    try:
        iw_dev_output = subprocess.check_output(["iw", "dev"]).decode("utf-8")
        # Regular expression to match the interface name
        match = re.search(r"Interface (\w+)", iw_dev_output)
        if match:
            return match.group(1)  # Return the interface name
    except subprocess.CalledProcessError as e:
        print(f"Failed to get wireless interface: {e}")
    return None


def get_signal_strength(interface):
    """
    Get the signal strength of the WiFi connection
    :param interface: The interface to use, e.g., wlan0
    :return: The signal strength
    """
    try:
        iwconfig_result = subprocess.check_output(["iwconfig", interface])
        signal_level = re.search(b"Signal level=(-\d+)", iwconfig_result)

        if signal_level:
            return int(signal_level.group(1))
    except subprocess.CalledProcessError as e:
        print(f"Failed to get signal strength for interface {interface}: {e}")
    return None


def measure_wifi(signal_strength):
    """
    Measure the wifi signal strength and return the categorization
    :param signal_strength: The signal strength in dBm
    :return: A qualitative assessment of the signal strength
    """
    if signal_strength > -50:
        return "Excellent"
    elif signal_strength > -60:
        return "Good"
    elif signal_strength > -70:
        return "Fair"
    elif signal_strength > -80:
        return "Poor"
    else:
        return "Disconnected or very weak signal"
