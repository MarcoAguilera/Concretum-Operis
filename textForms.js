require('dotenv').config();

const mongoose = require("mongoose");
const { convertToTimeZone } = require("date-fns-timezone"); 
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

try {
    mongoose.connect(process.env.MON_PASS, {useNewUrlParser: true, useUnifiedTopology: true, 'useFindAndModify': false});
    mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
    mongoose.set("useCreateIndex", true);

    const requestSchema = new mongoose.Schema({
        customer: String,
        email: String,
        phone: String,
        message: String,
        date: {type: Date, default: Date.now}
    });

    const Request = mongoose.model("Request", requestSchema);
    const t = convertToTimeZone(new Date(), {timeZone: 'America/Los_Angeles'});

    Request.find({}, function(err, res) {
        if(err) {
            console.log(err);
        }
        else {
            if(res.length > 0) {
                var count = 0;

                for(i = 0; i < res.length; i++) {
                    if(res[i].date.getMonth() == t.getMonth() && res[i].date.getDay() == t.getDay() && res[i].date.getFullYear() == t.getFullYear()) {
                        var count = 0;
                    }
                    count++;
                }

                if (count > 0) {
                    client.messages.create({
                        body: `There have been ${res.length} new requests made today. Make sure to check your calander.`,
                        from: '+15632783143',
                        to: '+18312102872'
                    }).then(message => console.log(message.sid));
                }
            }
        }
    
        mongoose.connection.close();
    });   
} catch (error) {
    console.log(error);
    mongoose.connection.close();
}