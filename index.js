const express = require('express');
const app = express();
const path = require('path');
const QRCode = require('qrcode');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const connectToMongoDB = require('./config/mongodb');
const asyncHandle = require('./utils/asyncHandle');
const Candidate = require('./models/Candidate');

connectToMongoDB();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
    express.urlencoded({
        // middleware xu li du lieu duoc submit len tu form
        extended: true,
    })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get(
    '/',
    asyncHandle(async (req, res) => {
        const candidates = await Candidate.find();
        res.render('home', { candidates });
    })
);

app.post(
    '/',
    asyncHandle(async (req, res) => {
        const candidate = req.body;
        if (candidate.full_name) {
            if (await Candidate.isCandidateExisted(candidate)) return;
            await Candidate.create(candidate);
        }
    })
);

app.get('/scan', (req, res) => {
    res.render('scan');
});

app.get(
    '/form',
    asyncHandle(async (req, res) => {
        res.render('form');
    })
);

app.post(
    '/form',
    asyncHandle(async (req, res) => {
        const candidate = {
            full_name: req.body.full_name,
            class: req.body.class,
            student_code: req.body.student_code,
            phone_num: req.body.phone_num,
        };

        QRCode.toDataURL(JSON.stringify(candidate), function (err, url) {
            if (err) return res.send('Something went wrong!!');
            res.render('qrcode', { qrcode: url });
        });
    })
);

io.on('connection', (socket) => {
    socket.on('candidate info', async (data) => {
        io.emit('candidate info', data);
    });
});

http.listen(port, (err) => {
    if (err) console.log(err);
    console.log(`Running socket.io server on ${port}`);
});
