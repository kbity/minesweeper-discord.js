process.on('uncaughtException', function (exception) {
   console.log('funni error uh oh!')
});

const { Client, GatewayIntentBits } = require ('discord.js');
const client = new Client ( { intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.once('ready', async () => {
  try {
    const commands = [];

    const command = await client.application.commands.create({
      name: 'minesweeper',
      description: 'Generate a Minesweeper Spoiler Game',
    });
    const help = await client.application.commands.create({
      name: 'help',
      description: 'How to play?',
    });

    commands.push(command);
    commands.push(help);

    console.log('Registered commands:', commands);
  } catch (error) {
    console.error('Failed to register commands:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'minesweeper') {

    // Generate the Minesweeper board
    const minesweeperBoard = generateMinesweeperBoard();

    // Convert the board to Discord emojis wrapped in spoiler tags
    const discordBoard = convertToDiscordEmojis(minesweeperBoard);

    // Convert to string
    let stringed = discordBoard.toString();
    let rows = stringed.split(',');

    // Split the rows into two parts
    const halfIndex = Math.ceil(rows.length / 2);
    const firstHalf = rows.slice(0, halfIndex).join('\n');
    const secondHalf = rows.slice(halfIndex).join('\n');

    // Send the first half as a reply to the command
    await interaction.reply(firstHalf);

    // Send the second half as a normal message
const channelId = interaction.channelId; // Get the channel ID where the command was executed
const channel = await interaction.client.channels.fetch(channelId);
const secondHalfMessage = await channel.send(secondHalf);

// React to the second half message
await secondHalfMessage.react('<:f_:1139350834778480680>');
await secondHalfMessage.react('<:l_:1139351570522329240>');
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;
  if (interaction.commandName === 'help') {
  await interaction.reply("Minesweeper Rules:\n1. If you find a <:x_:1139345434054242344>, you lose.\n2. Please don't cheat, if you post the solution, you may be banned depending on the server's mods.\n3. Once you reveal every tile that isn't a mine (in this 9x9 board, there is 10), you win.\n4. React <:f_:1139350834778480680> if you win, and <:l_:1139351570522329240> if you lose.\n5. The top left corner is always safe, so start there.");
    }
});

// Function to generate Minesweeper board
function generateMinesweeperBoard() {
  const boardSize = 9;
  const totalMines = 10;
  const board = [];

  // Initialize the board with empty cells
  for (let i = 0; i < boardSize; i++) {
    board[i] = [];
    for (let j = 0; j < boardSize; j++) {
      board[i][j] = 0;
    }
  }

  // Place mines randomly on the board, avoiding the top left corner and its three adjacent tiles
  const safeCells = new Set();
  safeCells.add('0,0');
  for (let row = 0; row <= 1; row++) {
    for (let col = 0; col <= 1; col++) {
      safeCells.add(`${row},${col}`);
    }
  }

  let minesPlaced = 0;
  while (minesPlaced < totalMines) {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);
    const cellKey = `${row},${col}`;
    
    if (!safeCells.has(cellKey) && board[row][col] !== 'M') {
      board[row][col] = 'M';
      minesPlaced++;
    }
  }

  // Calculate the number of adjacent mines for each cell
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (board[i][j] !== 'M') {
        let count = 0;
        // Check adjacent cells
        for (let row = i - 1; row <= i + 1; row++) {
          for (let col = j - 1; col <= j + 1; col++) {
            if (
              row >= 0 &&
              row < boardSize &&
              col >= 0 &&
              col < boardSize &&
              board[row][col] === 'M'
            ) {
              count++;
            }
          }
        }
        board[i][j] = count;
      }
    }
  }

  return board;
}

// Function to convert board to Discord emojis
function convertToDiscordEmojis(board) {
  const emojis = [
    '||<:__:1139345030612537375>||', // 0
    '||<:1_:1139344548083019836>||', '||<:2_:1139345260019974214>||', '||<:3_:1139350629672833114>||', '||<:4_:1139351457112535122>||', '||<:5_:1139352253178843218>||', '||<:6_:1139352702216851518>||', '||<:7_:1139352704091705414>||', '||<:8_:1139352255485718678>||' // 1-8
  ];
  const mineEmoji = '||<:x_:1139345434054242344>||';
  const discordBoard = [];

  for (let i = 0; i < board.length; i++) {
    const row = board[i];
    let discordRow = '';
    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      if (cell === 'M') {
        discordRow += mineEmoji;
      } else {
        discordRow += emojis[cell];
      }
    }
    discordBoard.push(discordRow);
  }

  return discordBoard;
}

// Login to Discord using the bot token
client.login('PUT.YOUR.BOT.TOKEN_HERE');

