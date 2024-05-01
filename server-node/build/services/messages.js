"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printInMemoMessages = exports.addMessage = exports.getInMemoMessages = void 0;
const inMemoMessages = [];
const getInMemoMessages = ({ limit } = {
    limit: 10
}) => {
    return inMemoMessages.slice(-limit);
};
exports.getInMemoMessages = getInMemoMessages;
const addMessage = (message) => {
    inMemoMessages.push(message);
};
exports.addMessage = addMessage;
const printInMemoMessages = () => {
    console.log('inMemoMessages ->', inMemoMessages);
};
exports.printInMemoMessages = printInMemoMessages;
