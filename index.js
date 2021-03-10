const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

const jb = require('./jb.json');

const dbClient = require("replitdb-client");
const DB = new dbClient();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	client.user.setActivity("For FAQ", { type: "WATCHING" });

	let data = DB.getAll()
		.then(data => console.log(data))
});

client.on('message', message => {
	prefix = DB.get(message.guild.id)
		.then(prefix => {

			const args = message.content.slice(prefix.length).trim().split(' ');
			const command = args.shift().toLowerCase();

			if (message.content.toLowerCase().startsWith(prefix.toLowerCase())) {

				switch (command) {

					default:
						message.channel.send('Unknown Command');
						break;
					case ("dblist"):
						let data = DB.getAll()
							.then(data => console.log(data))
						break;
					case ("prefix"):
						DB.set(message.guild.id, args[0]);
						message.channel.send("saved");
						break;
					case ("ping"):
						message.channel.send(`🏓 Pong! - Latency is ${Date.now() - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`);
						break;
					case ("jb"):
						version = args[0]
						if(jb.hasOwnProperty(version)){
							const response = new Discord.MessageEmbed()
							.setColor('#FFFFFF')
							.setAuthor(jb[version].title)
							.setDescription(jb[version].description)
							.setThumbnail(jb[version].image)
							.addFields(
								jb[version].resources[1],
								jb[version].resources[2],
								jb[version].resources[3]
							)
							.setTimestamp()
							.setFooter("MinxterYT's FAQ Bot", 'https://cdn.discordapp.com/avatars/719292655963734056/5ac32a24129a2d2a6762f824204180aa.webp');
							message.channel.send(response);
							break;
						}
						else {
							message.channel.send("resource not found")
						}
						break;
					case ("altstore"):
					console.log('ok')
						const response = new Discord.MessageEmbed()
						.setColor('#FFFFFF')
						.setAuthor('FAQ BOT')
						.setDescription('How to install altstore')
						.setThumbnail('https://i.imgur.com/I9T5Tko.png?1')
						.addFields(
							{
							"value": "[link to resource](https://altstore.io/)",
        			"name": "Altstore",
							"inline": true
							}
						)
						.setTimestamp()
						.setFooter("MinxterYT's FAQ Bot", 'https://cdn.discordapp.com/avatars/719292655963734056/5ac32a24129a2d2a6762f824204180aa.webp');
						message.channel.send(response);
						break;
				}
			}
		})
});

client.on("guildCreate", guild => {
	console.log("Joined guild => " + guild.name);
	DB.set(guild.id, "!");
	fs.appendFile(`Event Log.txt`, `Joined guild =>	${guild.name}\n`, (err) => {
		if (err) throw err;
	});
});

client.on("guildDelete", guild => {
	console.log("Left guild => " + guild.name);
	DB.delete(guild.id);
	fs.appendFile(`Event Log.txt`, `Left guild =>	${guild.name}\n`, (err) => {
		if (err) throw err;
	});
});


client.login(process.env.token);