const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Muestra la información completa del servidor."),
  async execute(interaction) {
    const { guild } = interaction;

    const totalChannels = guild.channels.cache.size;
    const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
    const categories = guild.channels.cache.filter(c => c.type === 4).size;

    const rolesCount = guild.roles.cache.size;
    const emojisCount = guild.emojis.cache.size;
    const stickersCount = guild.stickers.cache.size;

    const boostCount = guild.premiumSubscriptionCount || 0;
    const boostTier = guild.premiumTier ? `Nivel ${guild.premiumTier}` : "Ninguno";

    const verificationLevels = {
      0: "Ninguno",
      1: "Bajo",
      2: "Medio",
      3: "Alto (teléfono verificado)",
      4: "Máximo (verificación extrema)"
    };

    const serverInfoEmbed = new EmbedBuilder()
      .setAuthor({ name: `📊 Información del servidor`, iconURL: guild.iconURL({ dynamic: true }) })
      .setTitle(`${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 512 }))
      .setColor("Aqua")
      .setDescription(
        [
          `👑 **Dueño:** <@${guild.ownerId}>`,
          `🆔 **ID:** \`${guild.id}\``,
          `🌍 **Región:** \`${guild.preferredLocale}\``,
          `📆 **Creado el:** <t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
          `👥 **Miembros:** \`${guild.memberCount}\``,
          `🔐 **Nivel de verificación:** \`${verificationLevels[guild.verificationLevel]}\``,
          `💎 **Boosts:** \`${boostCount}\` (${boostTier})`,
          `\n🗂️ **Canales:**`,
          `> 💬 Texto: \`${textChannels}\` | 🔊 Voz: \`${voiceChannels}\` | 📁 Categorías: \`${categories}\` | 🌐 Total: \`${totalChannels}\``,
          `\n🎭 **Roles:** \`${rolesCount}\``,
          `😄 **Emojis:** \`${emojisCount}\` | 🩷 **Stickers:** \`${stickersCount}\``,
        ].join("\n")
      )
      .setFooter({
        text: `Comando ejecutado por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp();

    await interaction.reply({ embeds: [serverInfoEmbed] });
  },
};
