const { Client, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const express = require("express");
const cors = require("cors");
const colors = require("colors");

const app = express();

app.use(express.json());
app.use(cors({ origin: true }));

const client = new Client();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");

  app.post("/api/v1/wa/send", async (req, res, next) => {
    const { number, message } = req.body;
    await client.sendMessage(`521${number}@c.us`, message);

    console.log(`========= Mensaje Enviado =========`);

    res.status(201).json({
      message: `mensaje enviado al numero ${number} y el mensaje fue: ${message}`,
    });
  });

  app.post("/api/v1/wa/send-masive", async (req, res, next) => {
    const { numbers, message } = req.body;
    for (const number of numbers) {
      await client.sendMessage(`521${number}@c.us`, message);

      console.log(`========= Mensaje Enviado =========`);
    }
    res.status(201).json({
      message: `mensaje enviado al numero ${numbers} y el mensaje fue: ${message}`,
    });
  });

  app.post("/api/v1/wa/send-media-single", async (req, res, next) => {
    const { number, fileName } = req.body;
    const media = MessageMedia.fromFilePath(`./media/${fileName}`);

    await client.sendMessage(`521${number}@c.us`, media);

    console.log(`========= Mensaje Enviado =========`);
    res.status(201).json({
      message: `mensaje enviado al numero ${number} y el mensaje fue: ${media}`,
    });
  });

  app.post("/api/v1/wa/send-media-masive", async (req, res, next) => {
    const { numbers, fileName } = req.body;

    for (const number of numbers) {
      for (const media of fileName) {
        const medias = MessageMedia.fromFilePath(`./media/${media}`);
        await client.sendMessage(`521${number}@c.us`, medias);
      }
    }

    console.log(`========= Mensaje Enviado =========`);
    res.status(201).json({
      message: `mensaje enviado al numero ${numbers} y el mensaje fue: `,
    });
  });

  app.listen(5050, () => {
    console.log("Bienvenido a nuestro servidor de Whatsapp".yellow.underline);
  });
});

client.initialize();

// , "code.png", "gamakay.png", "hand.png", "headphones.png", "lights.png", "mac.png", "mesa.png", "mouse.png", "robot.png"
