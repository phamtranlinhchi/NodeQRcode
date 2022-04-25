const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    student_code: {
        type: String,
        required: true,
    },
    phone_num: {
        type: String,
        required: true,
    },
});

candidateSchema.statics.isCandidateExisted = async function (candidate) {
    const isExisted = await this.findOne(candidate);
    return !!isExisted;
};

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
