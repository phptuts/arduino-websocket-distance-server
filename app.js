const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 2222 });

let cm;
let inches;

wss.on('connection', (ws) => {
  console.info('websocket connection open');

  if (ws.readyState === ws.OPEN) {
    setInterval(() => {
      const message = JSON.stringify({
        cm,
        inches
      });
      console.log(message);
      ws.send(message);
    }, 1000);
  }
});

SerialPort.list().then((ports) => {
  usbPort = ports.find((port) => port.vendorId === '2341');

  if (!usbPort) {
    console.log('Nothing Connected');
    return;
  }
  const port = new SerialPort(usbPort.path, { baudRate: 9600 });

  const parser = new Readline();
  port.pipe(parser);
  parser.on('data', (line) => {
    const splitDifference = line.split('*');
    cm = splitDifference[0].replace('CM-', '');
    inches = splitDifference[1].replace('IN-', '').replace('|', '');
    console.log(cm, inches);
  });
});
