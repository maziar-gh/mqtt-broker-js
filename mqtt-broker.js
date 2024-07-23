require('dotenv').config();
const mqtt = require('mqtt');
const crypto = require('crypto');
const brokerUrl = 'mqtt://test.mosquitto.org';

const client = mqtt.connect(brokerUrl);

const encryptionKey = process.env.ENCRYPTION_KEY;

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

client.on('connect', () => {
  console.log('Connected to broker');
  // Publish a message every 5 seconds
  setInterval(() => {
    const message = JSON.stringify({ 
      slices: [
        {
            text: "20% OFF",
            value: 1,
            message: "You win 20% off",
            discount: "95Qm9tof",
            background: "#8c0a40",
            color: "#FFFFFF"
        },
        {
            text: "5% OFF",
            value: 1,
            message: "You win 5% off",
            discount: "5Qm9tof",
            background: "#ffffff",
            color: "#8c0a40"
        },
        {
            text: "30% OFF",
            value: 1,
            message: "You win 30% off",
            discount: "8C46fBeH",
            background: "#8c0a40",
            color: "#FFFFFF"
        },
        {
            text: "14% OFF",
            value: 1,
            message: "You win 14% off",
            discount: "4fBeH8C",
            background: "#ffffff",
            color: "#8c0a40"
        },
        {
            text: "40% OFF",
            value: 1,
            message: "You win 40% off",
            discount: "aHiH4bfd",
            background: "#8c0a40",
            color: "#FFFFFF"
        },
        {
            text: "78% OFF",
            value: 1,
            message: "You win 78% off",
            discount: "4bfd8C46",
            background: "#ffffff",
            color: "#8c0a40"
        }
    ]
     });
    const encryptedMessage = encrypt(message);
    client.publish('spinner/wheel', encryptedMessage);
    console.log('Encrypted message sent:', encryptedMessage);
  }, 5000);
});
