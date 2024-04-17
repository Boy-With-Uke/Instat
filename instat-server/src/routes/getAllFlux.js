module.exports = (app) => {
    app.get("/api/getAllFlux", async (req, res) => {
        res.json({message: "success",})
    })
}