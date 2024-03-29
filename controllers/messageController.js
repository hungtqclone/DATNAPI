const messageService = require('../services/messageService')

const getMessage = async (req, res) => {
    try {
        const { senderId, receiverId } = req.query
        const messages = await messageService.getMessage(senderId, receiverId);
        if (messages) {
            return res.status(200).json({ result: true, message: 'getMessage Succesful', messages: messages })
        }
        return res.status(400).json({ result: false, message: 'getMessage null' })

    } catch (error) {
        return res.status(500).json({ result: false, message: 'Error getMessage' })
    }
}

const newMessage = async (req, res) => {
    try {
        const messageData = req.query;
        const messages = await messageService.newMessage(messageData);
        if (messages) {
            return res.status(200).json({ result: true, message: 'addMessage Succesful' })
        }
        return res.status(400).json({ result: false, message: 'addMessage null' })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ result: false, message: 'Error addMessage' })
    }
}

module.exports = {
    getMessage, newMessage
}