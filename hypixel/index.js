module.exports = async (instance, opts, done) => {

    instance.register(require("./png/index"), {prefix: "png"})

    done()
}