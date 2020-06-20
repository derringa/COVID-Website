/*  filename: Email.js
    description: Contains logic necessary for making db calls and
                    sending daily emails.
*/

require('dotenv');
const path = require('path');
const nodeMailer = require('nodemailer');
const Email = require('email-templates');

class Email {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            }
        });

    }

    /*  name: sendEmail
        
    */
    sendEmail(context) {

        this.createTemplate(context)
        .then(content => {
            let info = await transporter.sendMail({
                from: process.env.FROM_EMAIL, 
                to: context.to,
                subject: "Daily COVID Update", // Subject line
                text: content[1],
                html: content[0],
              });
        })

    }

    createTemplate(context) {
        const em = new Email({
            view: {
                options: {
                    extension: 'handlebars'
                },
                juice: true,
                juiceResources: {
                    preserveImportant: true,
                    webResources: {
                        relativeTo: path.join(__dirname, '..', '/emails/build'),
                        images: true
                    }
                }
            }
        });

        return Promise.all([
            em.render('dailyUpdates/html.handlebars', {
                locale: 'en',
                title: 'Daily COVID Update',
                content: context,
            }),
            em.render('dailyUpdates/text.handlebars', {
                locale: 'en',
                title: 'Daily COVID Update',
                content: context
            })
        ]);
    }

}