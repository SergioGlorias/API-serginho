const { createCanvas, loadImage, registerFont } = require("canvas")
registerFont('hypixel/png/fonts/LeagueGothic-Regular-VariableFont_wdth.ttf', { family: 'League Gothic' })
const Hypixel = require('hypixel-api-reborn');
const hypixel = new Hypixel.Client(process.env.HYPIXEL_API_KEY, {
    cache: true,
    cacheTime: 300,
    syncWithHeaders: true,
    checkForUpdates: true
});
const axios = require("axios")
const { Buffer } = require('buffer');
const Readable = require('stream').Readable

module.exports = async (instance, opts, done) => {

    instance.get('/general/:User', async function (request, reply) {

        if (!request.params.User.endsWith(".png")) return { error: "need '.png'" }

        const user = request.params.User.split(".")[0]

        const pHy = await hypixel.getPlayer(user)

        const imgSkin = await loadImage(`https://crafatar.com/renders/head/${pHy.uuid}`)

        const canvas = createCanvas(800, 200)

        const ctx = canvas.getContext('2d')

        ctx.drawImage(imgSkin, 15, 15, 170, 170)

        ctx.font = '50px "League Gothic"'
        ctx.fillStyle = '#0ec8f7'
        ctx.fillText((pHy.rank !== "Default" ? ("[" + pHy.rank + "] ") : ("")) + pHy.nickname, 200, 70)

        ctx.font = '40px "League Gothic"'
        ctx.fillStyle = '#42aa01'
        ctx.fillText("Level: " + pHy.level.toFixed(0) + " (" + (pHy.levelProgress.percent).toFixed(0) + "%)", 200, 120)
        ctx.fillStyle = '#cae002'
        ctx.fillText("Achievements: " + pHy.achievementPoints , 200, 170)
        ctx.fillStyle = '#c604f2'
        ctx.fillText("Karma: " + pHy.karma , 500, 120)

        reply.type("image/png").send(canvas.createPNGStream())

    })

    done()
}