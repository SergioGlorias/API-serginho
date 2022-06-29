const { createCanvas, loadImage, registerFont } = require("canvas")
registerFont('hypixel/png/fonts/LeagueGothic-Regular-VariableFont_wdth.ttf', { family: 'League Gothic' })
const Hypixel = require('hypixel-api-reborn');
const hypixel = new Hypixel.Client(process.env.HYPIXEL_API_KEY, {
    cache: true,
    cacheTime: 300,
    syncWithHeaders: true,
    checkForUpdates: true
});

module.exports = async (instance, opts, done) => {

    instance.get('/general/:User', async function (request, reply) {

        const user = request.params.User.endsWith(".png") 
            ? request.params.User.substring(0, request.params.User.length - 4) 
            : request.params.User;

        const pHy = await hypixel.getPlayer(user)

        const imgSkin = await loadImage(`https://crafatar.com/renders/head/${pHy.uuid}`)

        const canvas = createCanvas(800, 200)

        const ctx = canvas.getContext('2d')

        ctx.drawImage(imgSkin, 15, 15, 170, 170)

        ctx.font = '50px "League Gothic"'

        let rankColor
        switch (pHy.rank) {
            case "VIP":
                rankColor = "#00FF00"
                break;
            case "VIP+":
                rankColor = "#00FF00"
                break;
            case "MVP":
                rankColor = "#00fff6"
                break;
            case "MVP+":
                rankColor = "#00fff6"
                break;
            case "MVP++":
                rankColor = "#ffb200"
                break;
            case "Game Master":
                rankColor = "#00a30d"
                break;
            case "ADMIN":
                rankColor = "#ce0000"
                break;
            case "YOUTUBE":
                rankColor = "#ff0000"
                break;
            default:
                rankColor = "#c1c1c1"
                break;
        }

        ctx.fillStyle = rankColor
        ctx.fillText((pHy.rank !== "Default" ? ("[" + pHy.rank + "] ") : ("")) + pHy.nickname, 200, 70)
        ctx.font = '40px "League Gothic"'
        ctx.fillStyle = '#42aa01'
        ctx.fillText("Level: " + pHy.level.toFixed(0) + " (" + (pHy.levelProgress.percent).toFixed(0) + "%)", 200, 120)
        ctx.fillStyle = '#cae002'
        ctx.fillText("Achievements: " + pHy.achievementPoints , 200, 170)
        ctx.fillStyle = '#c604f2'
        ctx.fillText("Karma: " + pHy.karma , 500, 120)
        
        //add circle solid color to online status
        ctx.beginPath()
        ctx.arc(150, 165, 20, 0, 2 * Math.PI)
        ctx.fillStyle = pHy.isOnline ? '#5dbf0d' : '#c11107'
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.arc(150, 165, 15, 0, 2 * Math.PI)
        ctx.fillStyle = pHy.isOnline ? '#77fc0a' : '#ff3328'
        ctx.fill()
        ctx.closePath()


        reply.type("image/png").send(await canvas.toBuffer())
    })

    done()
}