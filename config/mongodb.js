const mongoose = require('mongoose');

const connect = async () => {
    await mongoose
        .connect(process.env.MONGODB || 'mongodb://localhost:27017/recruitment')
        .then(() => console.log('Connected to mongo database'))
        .catch((err) => console.log(err));
};

module.exports = connect;
