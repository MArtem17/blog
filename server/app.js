const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const fs = require('fs')
const crypto = require("crypto")
const fileUpload = require('express-fileupload')
const bodyParser = require('body-parser')
app.use(fileUpload({
    createParentPath: true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

var posts = []

app.post('/new_post', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let image = req.files.image
            const path = 'assets/image/'
            var path1 = 'assets/image/' + image.name
            // const path = 'static/image/'
            // var path1 = 'static/image/' + image.name
            var name = image.name
            if (fs.existsSync(path1)) {
                var id = crypto.randomBytes(16).toString("hex")
                path1 = path + "(" + id + ")" + image.name
                name = "(" + id + ")" + image.name
                image.mv(path1)
            } else {
                image.mv(path1)
            }
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: name,
                    mimetype: image.mimetype,
                    size: image.size,
                }
            });
        }
    } catch (err) {
        res.status(500).send(err)
    }
})
app.get('/index', async (req, res) => {
    posts = []
    //if (!posts.length) {
    let raw = fs.readFileSync('server/posts.json')
    posts = JSON.parse(raw)
    //}
    posts_reverse = posts.reverse()
    res.send({
        status: true,
        message: 'posts',
        data: {
            ...{
                posts: posts_reverse
            }
        }
    })
})
app.post('/post', async (req, res) => {
    const data = req.body
    var post = {}
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id == data.id) {
            post = posts[i]
        }
    }
    res.send({
        status: true,
        message: 'post',
        data: {
            ...{
                post: post
            }
        }
    })
})

io.on('connection', socket => {
    console.log("Client IO connected")
    socket.join('0')
    socket.on("new_post", (data, cb) => {
        if (!data.author || !data.title || !data.text_demo || !data.text || !data.img) {
            return cb("Данные не корректны")
        }
        (async () => {
            posts = []
            let raw = fs.readFileSync('server/posts.json')
            posts = JSON.parse(raw)
            var id = posts.length + 1
            var new_post = {
                id: id.toString(),
                img: data.img[0],
                img1: data.img[1],
                title: data.title,
                text: data.text,
                text_demo: data.text_demo,
                author: data.author
            }
            posts.push(new_post)
            fs.writeFile('server/posts.json', JSON.stringify(posts, null, 2), (err) => {
                if (err) throw err
            })
            socket.to('0').emit("createNewPost", new_post)
            cb(new_post)
        })()
    })
})

module.exports = {
    app, server
}