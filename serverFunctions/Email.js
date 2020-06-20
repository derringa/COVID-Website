/*  filename: Email.js
    description: Contains logic necessary for making db calls and
                    sending daily emails.
*/

require('dotenv').config();
const path = require('path');
const nodeMailer = require('nodemailer');
const EmailTemplate = require('email-templates');
const MailingList = require('../dao.js').MailingList;
const CovidTracking = require('./CovidTracking.js').CovidTracking;
const SetInterval = require('setinterval-plus');

class EmailController {
    constructor() {
        this.db = new MailingList("./db/covid-listserv.db");
        this.covidTracking = new CovidTracking();
        this.email = new Email();

    }

    sendScheduledEmails() {
        this.db.generateMailingList()
            .then(sendList => {
                let contexts = this._extractDbFields(sendList);
                contexts.forEach(dataReq => {
                    this._makeApiCalls(dataReq.state, dataReq)
                        .then(() => {
                            this.email.sendEmail(dataReq);
                        })

                })

            })
            .catch(err => {
                console.log(err);
            })
    }

    _makeApiCalls(states, context) {
        let awaitPromises = [];
        states.forEach(state => {
            awaitPromises.push(
                this.covidTracking.getState(state.name)
                    .then(apiCall => {
                        states.push({
                            hospitalizedCurrently: apiCall.hospitalizedCurrently,
                            positive: apiCall.positive,
                            negative: apiCall.negative,
                            inIcuCurrently: apiCall.inIcuCurrently,
                            state: apiCall.state,
                        });

                        return;
                    })
            );
        })

        return Promise.all(awaitPromises);

    }

    /*  name: _extractDbFields
        preconditions: sendList is object returned from dao.js call of form:
                {
                    'email@something.com: {
                        fname: ,
                        lname: ,
                        regions: {
                            or: ['field1', 'field2', '...']
                        },
                    }
                }
        postconditions: Returns array of objects of the form:
        context[0] = {
                    to: email,
                    firstname: ,
                    lastname: ,
                    state: [{
                            name: ,
                            datafields: ['field1', 'field2', '...']
                            }]
                    }
        description: Takes object returned from call to dao.js and
                        restructures object to more friendly structure
                        when making calls to external apis, iterating through
                        to send emails, etc.
    */
    _extractDbFields(sendList) {
        let contexts = [];
        let keys = Object.keys(sendList);

        keys.forEach((key, ind) => {
            contexts.push({
                to: key,
                firstname: sendList[key].fname,
                lastname: sendList[key].lname,
                state: [],
            })
            let stateKeys = Object.keys(sendList[key].regions)

            stateKeys.forEach(stateKey => {
                contexts[ind].state.push({
                    name: stateKey,
                    datafields: sendList[key].regions[stateKey]
                });
            })

        })

        return contexts;
    }

    startEmailIntervals() {
        let setInterval = new SetInterval(() => {
            this.sendScheduledEmails();
        }, 3000);
    }
}

class Email {

    constructor() {
        this.transporter = nodeMailer.createTransport({
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
        arguments: context = {
                                to: email,
                                firstname: ,
                                lastname: ,
                                state: [{
                                        name: ,
                                        positive: ,
                                        negative: ,
                                        hospitalizedCurrently: ,
                                        isIcuCurrently: ,
                                        }]

                            }
    */
    sendEmail(context) {
        console.log(context);
        return this.createTemplate(context)
            .then(content => {
                return this.transporter.sendMail({
                    from: process.env.FROM_EMAIL,
                    to: context.to,
                    subject: "Daily COVID Update", // Subject line
                    text: content[1],
                    html: content[0],
                });
            })

    }

    createTemplate(context) {
        const em = new EmailTemplate({
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

module.exports = { EmailController };
