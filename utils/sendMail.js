const sgMail = require('@sendgrid/mail');
const keys = require('../config/keys');
sgMail.setApiKey(keys.SendGridKey);

module.exports = {
    sendMail(toMail, user_id) {
        const msg = {
            to: toMail,
            from: 'bhupabhupa@gmail.com',
            subject: 'Reset Password ',
            html: `Please click <a href="${keys.ClientURI}/reset_password/${user_id}">here</a> on below url to reset your password.`,
          };
          sgMail.send(msg);
    }
}


