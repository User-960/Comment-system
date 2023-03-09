import "./index.html";
import "./index.scss";

import CommentSystem from "./components/CommentSystem/CommentSystem";
const avatar: string = require("./images/ava.png");

// Initialization of the commenting system
const commentSystem = new CommentSystem();
commentSystem.createUser("Harry Potter", avatar);
