require("dotenv").config();
const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
const {authenticateToken} = require("./utilities"); 
const User = require("./model/user.model");
const Note = require("./model/note.model");

const jwt = require("jsonwebtoken");

const config = require("./config.json");

const app = express();
mongoose.connect(config.connectionString);

app.use(express.json());
app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req, res) => {
    res.json({ data: "hello" });
});

// Create Account
app.post("/create-account", async (req, res) => {
    const { fullname, email, password } = req.body;

    if (!fullname) {
        return res.status(400).json({ error: true, message: "Full Name is required" });
    }
    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });
    if (isUser) {
        return res.json({
            error: true,
            message: "User Already Exists",
        });
    }

    const user = new User({ fullname, email, password });
    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "360000m",
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration Successful",
    });
});

// Login Account
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }
    if (!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.status(400).json({ error: true, message: "User Not Found" });
    }

    if (userInfo.email === email && userInfo.password === password) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "360000m",
        });

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken,
        });
    } else {
        return res.status(400).json({
            error: true,
            message: "Invalid Credentials",
        });
    }
});


// Get User
app.get("/get-user",authenticateToken, async (req, res) => { 
    const { user } = req.user;
    const isUser = await User.findOne({_id: user._id});
    if(!isUser){
        return res.sendStatus(401);
    }
    return res.json({
        user: {
            fullname : isUser.fullname,
            email : isUser.email,
            _id:isUser._id,
            createdOn: isUser.createdOn

        },
        message: "",
    })
});   


// Add Note
app.post('/add-note', authenticateToken, async (req, res) => {
    const { title, content, tags, imgUrl, price } = req.body;
    const { user } = req.user;

    if (!title) {
        return res.status(400).json({ error: true, message: 'Title is required' });
    }
    if (!content) {
        return res.status(400).json({ error: true, message: 'Content is required' });
    }
    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            imgUrl: imgUrl || null, // Include imgUrl
            price: price || 0, // Include price
            userId: user._id,
        });
        await note.save();
        return res.json({
            error: false,
            note,
            message: 'Note added successfully',
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: 'Internal Server Error',
        });
    }
});


// Edit Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned, imgUrl, price } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags && imgUrl === undefined && price === undefined) {
        return res.status(400).json({ error: true, message: "No changes provided" });
    }
    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }
        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned !== undefined) note.isPinned = isPinned;
        if (imgUrl !== undefined) note.imgUrl = imgUrl; // Update imgUrl
        if (price !== undefined) note.price = price; // Update price

        await note.save();

        return res.json({ error: false, note, message: "Note updated successfully" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});


// Get All Notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
    const { user } = req.user;
    try {
        const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
        return res.json({
            error: false,
            notes,
            message: "All notes retrieved successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});


// Delete Note
app.delete("/delete-note/:noteId",authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        await Note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({
            error: false,
            message: "Note deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});


// Update isPinned Value
app.put("/update-note-pinned/:noteId",authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal server error",
        });
    }
});


// serch Note
app.get("/serch-notes/",authenticateToken, async (req, res) => {
    const {user} =req.user;
    const {query} = req.query;

    if(!query){
        return res.status(400).json({error:true, message:"Serch Query is required"})
    }
    try {
        const matchigNotes = await Note.find({
            userId: user._id,
            $or: [
                {title: {$regex: new RegExp(query, "i")}},
                {content: {$regex: new RegExp(query, "i")}},
            ]
        })
        return res.json({
            error:false,
            notes:matchigNotes,
            message: "Notes Matching the Serch query Relrieved Successfully",
        });
    } catch (error) {
        return res.status(500).json({error:true,message: "Internal Server Error" })
    }
});


app.listen(8000, () => {
    console.log("Server running on port 8000");
});

module.exports = app;