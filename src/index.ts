import "./index.html";
import "./index.scss";

import UserForm from "./components/UserForm/UserForm";
import Comments from "./components/Comments/Comments";
const avatar: string = require("./images/ava.png");

// Initialization of the commenting system
const userForm = new UserForm();
const comments = new Comments(userForm);
comments.createUser("Harry Potter", avatar);
