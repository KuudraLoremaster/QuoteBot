const { REST } = require('discord.js')
const { Routes } = require('discord-api-types/v9')

const fs = require('fs');
const { log } = require('../../util/logger');

module.exports = (client) => {
    client.handleCommands = async() => {
        const commandFolders = fs.readdirSync('./src/commands')
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'))
            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
                log(`Command ${command.data.name} has been passed through the handler`)
            }
        }

        const clientId = '1235165635739389983';
        const guildId = '1162056243125432391'; // please remember to change this it's so fucking dumb
        // const rest = new REST({ version:'10' }).setToken(process.env.token);
        // try {
        //     console.log('Started refreshing applications (/) commands');
        //     await rest.post(Routes.applicationGuildCommands(clientId, guildId), {
        //         body: client.commandArray
        // });
        //     console.log('Succesfully reloaded applications (/) commands')
        // } catch (error) {
        //     console.error(error)
        // }
// const rest2 = new REST({ version: '10' }).setToken(process.env.token);

// try {
//     console.log('Started refreshing applications (/) commands');
// 	await rest.put(Routes.applicationCommands(clientId), {
// 		body: {
// 			content: client.commandArray,
// 		},
// 	});
// } catch (error) {
// 	console.error(error);
const rest = new REST().setToken(process.env.token);

// and deploy your commands!
(async () => {
	try {
		log(`Started refreshing application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: client.commandArray },
		);

		log(`Successfully reloaded application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
}}