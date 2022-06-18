const fastify = require('fastify')({
    logger: true,
    ignoreTrailingSlash: true,
    trustProxy: true,
})

fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
})

fastify.get("/headers", async (request, reply) => {
    return request.headers
})

const start = async () => {
    try {
        await fastify.listen(8745)
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()