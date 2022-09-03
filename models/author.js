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
        return (this.date_of_birth) ? 
            this.date_of_birth.toLocaleDateString("en-US", { dateStyle: 'long' }) : "";
    });

AuthorSchema
    .virtual('lifeSpan')
    .get(function() {
      const birthDate = (this.date_of_birth) ? this.date_of_birth.toDateString('en-US', { dateStyle: 'long' }) : '';
      const deathDate = (this.date_of_death) ? this.date_of_death.toDateString('en-US', { dateStyle: 'long' }) : '';
      return `${birthDate} - ${deathDate}`;
    })

AuthorSchema
    .virtual("deathDateFormatted")
    .get(function() {
        //return '2000-10-05';
        return (this.date_of_death) ? 
            DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATETIME_MED) : "";
    });

module.exports = mongoose.model("Author", AuthorSchema);
