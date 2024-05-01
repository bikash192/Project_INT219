"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printInMemoUsers = exports.deleteId = exports.register = exports.getInMemoUsers = void 0;
const inMemoUsers = [];
const getInMemoUsers = () => inMemoUsers;
exports.getInMemoUsers = getInMemoUsers;
const register = ({ id, socket, data }) => {
    const user = { id, socket, data };
    inMemoUsers.push(user);
};
exports.register = register;
const deleteId = (id) => {
    const index = inMemoUsers.findIndex((user) => user.id === id);
    if (index !== -1) {
        inMemoUsers.splice(index, 1);
    }
};
exports.deleteId = deleteId;
const printInMemoUsers = () => {
    console.log('inMemoUsers ->', inMemoUsers.map((user) => user.id));
};
exports.printInMemoUsers = printInMemoUsers;
