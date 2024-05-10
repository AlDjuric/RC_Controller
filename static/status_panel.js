function fetchWiFiSignal() {
    return fetch('/wifi-signal')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);  // Debugging log to see the fetched data
            document.getElementById('signal-quality').textContent = 'Quality: ' + data.quality;
            document.getElementById('signal-strength').textContent = 'Signal Strength: ' + data.signal_strength;
            return data.signal_strength;
        })
        .catch(error => console.error('Could not fetch WiFi signal strength.', error));
}

function displayWifiSignalStrength() {
    fetchWiFiSignal().then(signalStrength => {
        // Assuming signalStrength is a string containing a number like "-59"
        const strengthValue = parseInt(signalStrength); // Make sure to parse it as an integer

        const wifiSignalElement = document.getElementById('signal-strength');
        if (strengthValue >= -50) {
            wifiSignalElement.style.color = 'green'; // Excellent
        } else if (strengthValue >= -60) {
            wifiSignalElement.style.color = 'cyan'; // Good
        } else if (strengthValue >= -70) {
            wifiSignalElement.style.color = 'yellow'; // Fair
        } else if (strengthValue >= -80) {
            wifiSignalElement.style.color = 'red'; // Poor
        } else {
            wifiSignalElement.style.color = 'grey'; // Disconnected or very weak signal
        }
    });
}
// Call displayWifiSignalStrength on page load and every 5 seconds after
document.addEventListener('DOMContentLoaded', () => {
    displayWifiSignalStrength();
    setInterval(displayWifiSignalStrength, 5000);
});

document.querySelector('.tooltip-icon').addEventListener('mousemove', function (e) {
    var tooltip = document.querySelector('.tooltip-content');
    tooltip.style.left = e.pageX + 'px';
    tooltip.style.top = e.pageY + 'px';
});