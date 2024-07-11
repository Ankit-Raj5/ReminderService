const express = require('express');
const bodyParser = require('body-parser');

const {PORT, REMINDER_BINDING_KEY} = require('./config/serverConfig');
// const {sendBasicEmail} = require('./services/email-service');
const jobs = require('./utils/job');
const TicketController = require('./controllers/ticket-controller');
const {createChannel, subscribeMessage} = require('./utils/messageQueue');
const EmailService = require('./services/email-service');

const setupAndStartServer = async () =>{
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    const channel = await createChannel();
    subscribeMessage(channel, EmailService.subscribeEvents, REMINDER_BINDING_KEY);

    app.post('/api/v1/tickets', TicketController.create);

    app.listen(PORT, () =>{
        console.log(`Server Started on port no:  ${PORT}`);
        //jobs();
    });
} 

setupAndStartServer();