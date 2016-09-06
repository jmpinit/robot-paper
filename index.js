const SerialPort = require('serialport');

const port = new SerialPort('/dev/tty.usbmodem14211', {
    baudRate: 115200,
    parser: SerialPort.parsers.readline('\n'),
    autoOpen: false,
});

// === TODO make class

const robot = {
    ready: false,
    messageQueue: [],
};

function sendNext(rob) {
    if (rob.messageQueue.length > 0) {
        const msg = rob.messageQueue.shift();
        console.log(`sending: ${msg}`);
        setTimeout(() => port.write(msg), 10);
    }
}

port.on('data', data => {
    console.log(`got data: ${data}`);

    if (data.toString().trim() === 'Grbl 0.9j [\'$\' for help]') {
        robot.ready = true;
        console.log('ready');
        sendNext(robot);
    } else if (data.toString().trim() === 'ok') {
        sendNext(robot);
    }
});

function moveTo(x, y) {
    return ['G90\n', `G0X${x}Y${y}Z0\n`];
}

function sendToRobot(msgs) {
    msgs.forEach(msg => robot.messageQueue.push(msg));
}

// ========

port.open(err => {
    if (err) {
        console.log('Error opening port: ', err.message);
    } else {
        console.log('homing...');
        sendToRobot(moveTo(10, 10));
    }
});

port.on('open', () => {
    console.log('port opened');
});
