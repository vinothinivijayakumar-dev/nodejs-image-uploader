var e = require('express');
var m = require('multer');
var fs = require('fs');
var path = require('path');
var cors = require('cors');

var app = e();

//Render’s dynamic PORT
var port = process.env.PORT || 3000;

app.use(cors({
    origin: 'https://nodejs-image-uploader.netlify.app/' 
}));

// Multer Storage Setup 
var storage = m.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

var upload = m({ storage: storage });

// Middleware 
app.use(e.static('public'));
app.use('/uploads', e.static('uploads'));

// Routes 
// Serve index.html
app.get('/', (req, res) => {
    fs.readFile(path.join(__dirname, '/public/index.html'), (err, data) => {
        if (err) {
            res.status(500).send('Error loading index.html');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }

    });
});

// Handle file upload
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        res.status(400).send('No file uploaded.');
    }

    var imageurl = `/uploads/${req.file.filename}`;
    res.send(`
      <body style="font-family:Poppins, sans-serif; background:linear-gradient(135deg, #8EC5FC, #E0C3FC); color:#333; text-align:center; padding:40px;">
        <h1>✅ Upload Successful!</h1>
        <p>Your image is available below:</p>
        <img src="${imageurl}" style="max-width:400px; border-radius:10px; box-shadow:0 4px 20px rgba(0,0,0,0.2);"/>
        <br><br>
        <a href="/" style="background:#2575fc; color:white; padding:10px 20px; border-radius:8px; text-decoration:none;">Upload Another</a>
      </body>
    `);
});

// Start Server
app.listen(port, () => {
    console.log(`Server Running at http://localhost:${port}`);
});


