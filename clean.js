const { Client, GatewayIntentBits } = require ('discord.js');
const client = new Client ( { intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // Delete all commands for a specific guild
  await client.guilds.cache.get('1091034377988866150').commands.set([]);
  // Delete all commands globally
  // await client.application.commands.set([]);
  console.log('All commands deleted!');
});

client.login('PUT.YOUR.BOT.TOKEN_HERE');
