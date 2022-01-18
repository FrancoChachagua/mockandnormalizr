const {default:MessagesMongo} = await import('./messages/messagesMongo.js');
let messages = new MessagesMongo();

export {messages}