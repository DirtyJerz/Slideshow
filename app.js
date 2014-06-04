var express = require('express') 
    , app = express()
    , server = require('http').Server(app)
    , io = require('socket.io')(server)
    , doT = require('dot')
    , slide = 0
    , slides = [
        'FHD_R.BMP',
        'FHD_G.BMP',
        'FHD_B.BMP',
	'FHD_W.BMP',
	'FHD_Black.bmp',
	'FHD_chessboard_440ppi.bmp',
    ];

server.listen(70, '192.168.10.1'); // listen on port 70
//server.listen(70, '10.0.110.32'); // listen on port 70

var engines = require('consolidate');

app.set('views', __dirname + '/views');
app.engine('html', engines.dot);
app.set('view engine', 'html');
app.set('view options', {layout:false}); // keep it simple
app.use(express.static(__dirname + '/images'));

doT.templateSettings.strip=false; // don't strip line endings from template file

app.get('/', function(req, res) {
    res.render('index.html', { slide: slide, slides: slides });
});

app.get('/jquery.min.js', function(request, response){
  response.sendfile(__dirname + "/views/jquery.min.js");
});

app.post('/next', function(req, res) {
    next();
    res.send(204); // No Content
});

setInterval(next, 4000); // advance slides every 4 seconds

function next() {
    if (++slide >= slides.length) slide = 0;
    io.sockets.emit('slide', slide);
}
