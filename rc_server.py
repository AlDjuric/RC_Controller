"""
Author: Aleksandar Djuric
Email: aleksandar.djuriic@gmail.com
Created: 2024-03-13
Last Modified: 2024-04-05
Description: Flask application to control a robot over WiFi using a web interface
"""

from flask import Flask, jsonify, request, render_template
import controller as ctrl
import wifi_signal as ws

# IP address of the server
# Check with ifconfig
# could also just use '0.0.0.0' to listen on all public IPs
server_ip_address = "0.0.0.0"  # Change this to the IP address of the server


app = Flask(__name__)


@app.route("/command", methods=["POST"])
def command():
    return ctrl.controller(
        request.form.get("command"), request.form.get("pwm", type=int)
    )


# ********************************************
# Wifi signal strength
# ********************************************
@app.route("/wifi-signal")
def wifi_signal():
    interface = ws.get_wireless_interface()
    if interface:
        signal_strength = ws.get_signal_strength(interface)
        quality = ws.measure_wifi(signal_strength)
        return jsonify({"quality": quality, "signal_strength": signal_strength})
    else:
        return jsonify({"quality": "No WiFi", "signal_strength": None})


# ********************************************
@app.route("/")
def hello():

    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True, host=server_ip_address, port=5000)
