const Discord = require("discord.js");
const config = require("../config.js");
const log = require("leekslazylogger");
const fetch = require('node-fetch');
module.exports = {
    name: 'prune',
    description: 'Bulk-delete messages',
    usage: '<1-99>',
    aliases: ['purge'],
    example: 'prune 99',
    args: true,
    cooldown: config.cooldown,
    guildOnly: true,
    adminOnly: true,
    async execute(message, args) {
        const client = message.client;
        // command starts here
        if (message.channel.permissionsFor(message.channel.guild.me).has('MANAGE_MESSAGES')) {

            let amount = parseInt(args[0])

            if (isNaN(amount)) {
                return message.channel.send(
                    new Discord.MessageEmbed()
                    .setColor("#E74C3C")
                    .setTitle(`Error`)
                    .setDescription(`:x: **»** Invalid number. Type \`${config.prefix}help prune\` for help.`)
                );

            } else if (amount < 1 || amount > 99) {
                return message.channel.send(
                    new Discord.MessageEmbed()
                    .setColor("#E74C3C")
                    .setTitle(`Error`)
                    .setDescription(`:x: **»** Number of messages to delete must be 1-99 (\`1 < number < 100\`)`)
                );
            }

            amount+=1;

            message.channel.bulkDelete(amount, true).then(() => {
                message.channel.send(
                    new Discord.MessageEmbed()
                    .setColor(config.colour)
                    .setTitle(`Messages pruned`)
                    .setDescription(`:white_check_mark: **»** Deleted ${amount} messages`)
                );

                client.channels.cache.get(config.log_chan_id).send(
                    new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.avatarURL())
                    .setColor(config.colour)
                    .setTitle("Messages pruned")
                    .addField("By", message.author, true)
                    .addField("Messages", amount, true)
                    .setFooter(config.name, client.user.avatarURL())
                    .setTimestamp()
                );
            }).catch(err => {
                log.error(err);
                message.channel.send(':bangbang: **»** An error occured');
            });

        } else {
            message.channel.send(":bangbang: **»** Permission error")
        }

        

    }
}