const mongoose = require("mongoose");
const { DateTime } = require("luxon")

const AuthorSchema = new mongoose.Schema({
    first_name: { type: String, required: true, maxLength: 100 },
    family_name: { type: String, required: true, maxLength: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date }
});

AuthorSchema
    .virtual("name")
    .get(function() {
        let fullName = "";
        if(this.first_name && this.family_name) {
            fullName = `${this.family_name}, ${this.first_name}`
        }
        return fullName;
    });

AuthorSchema
    .virtual("url")
    .get(function() {
        return `/catalog/author/${this._id}`;
    });

AuthorSchema
    .virtual("birthDateFormatted")
    .get(function() {
        return DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATETIME_MED);
    });

AuthorSchema
    .virtual("deathDateFormatted")
    .get(function() {
        return DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATETIME_MED);
    });

module.exports = mongoose.model("Author", AuthorSchema);