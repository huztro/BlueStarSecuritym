const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const fs = require("fs");

// ================= CLIENT =================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

// ================= COLLECTION =================
client.commands = new Collection();

// ================= LOAD COMMANDS =================
const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
  const files = fs.readdirSync(`./commands/${folder}`).filter(f => f.endsWith(".js"));

  for (const file of files) {
    const command = require(`./commands/${folder}/${file}`);
    if (command.name) {
      client.commands.set(command.name, command);
    }
  }
}

// ================= LOAD EVENTS =================
const eventFiles = fs.readdirSync("./events").filter(f => f.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// ================= ERROR HANDLING =================
process.on("unhandledRejection", err => {
  console.log("Unhandled Promise Rejection:", err);
});

process.on("uncaughtException", err => {
  console.log("Uncaught Exception:", err);
});

// ================= LOGIN =================
client.login("YOUR_BOT_TOKEN");
