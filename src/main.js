const { exec } = require('child_process');
function getSomething() {
    exec('wmic path Win32_SerialPort get DeviceID', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error listing COM ports: ${error.message}`);
            return;
        }

        const lines = stdout.trim().split('\n');
        const ports = lines.slice(1).map(line => {
            return line.trim();
        });

        ports.forEach(port => {
            console.log(`- ${port}`);
        });
    });
}

module.exports = getSomething;
