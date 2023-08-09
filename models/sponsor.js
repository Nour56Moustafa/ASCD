const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ['golden', 'silver', 'diamond'] },
    companyID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Company' },
});

const Sponsor = mongoose.model('Sponsor', sponsorSchema);

module.exports = Sponsor;