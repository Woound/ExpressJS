const express = require("express"); //Express setup.
const app = express();
const path = require("path");
const methodOverride = require("method-override"); //Needed to overcome the unavailability of PATCH/PUT/DELETE requests in the browser.
const { v4: uuidv4 } = require('uuid'); //Package to create uuids.
uuidv4();

app.set("views", path.join(__dirname), "views"); //Ejs setup.
app.set("view engine", "ejs");

app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true })); // To parse form data.
app.use(express.json());

let comments = [ //Using array to imitate a database.
    {
        id: uuidv4(),
        username: "TheLegend27",
        comment: "A naked man fears no pick pocket."
    },
    {
        id: uuidv4(),
        username: "noobMaster69",
        comment: "Bread - Sun Tzu"
    },
    {
        id: uuidv4(),
        username: "TitanNic",
        comment: "Thou shall perish"
    }
];

app.get("/comments", (req, res) => {
    res.render("views/comments/index.ejs", { comments });
});

app.get("/comments/new", (req, res) => {
    res.render("views/comments/new.ejs");
});

app.post("/comments", (req, res) => { //POST request sent to add data to the array.
    const { username, comment } = req.body;
    comments.push({ username, comment, id: uuidv4() });
    res.redirect("/comments"); //Redirection to /comments to prevent multiple submissions of data.
})

app.get("/comments/:id", (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id); //Ignoring error-handling for now but should be implemented. 
    res.render("views/comments/show.ejs", { comment });
});

app.get("/comments/:id/edit", (req, res) => {
    const { id } = req.params;
    const comment = comments.find(c => c.id === id);
    res.render("views/comments/edit.ejs", { comment });
});

app.patch("/comments/:id", (req, res) => {
    const { id } = req.params; // Taking the id from the URL.
    const newCommentText = req.body.comment; //Taking whatever was sent in the request.body.
    const foundComment = comments.find(c => c.id === id); //We are then finding the comment with that ID (no error handling yet)
    foundComment.comment = newCommentText; // We then update the comment to the new comment property.
    res.redirect("/comments")
});

app.delete("/comments/:id", (req, res) => {
    const { id } = req.params;
    const foundComment = comments.find(c => c.id === id);
    comments = comments.filter(c => c.id !== id); //Filtering everything out to a new array from the old one, except the comment we want to delete.
    // ^ Note: Normally you should avoid mutating arrays.
    res.redirect("/comments");
});

app.get("/", (req, res) => {
    res.send("Welcome to our forum!");
});

app.listen(3000, () => {
    console.log("Listening on port 3000!");
});