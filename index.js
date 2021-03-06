const express = require('express');
const nunjucks = require('nunjucks');

const app = express();

nunjucks.configure('views', {
	autoescape: true,
	express: app
});

app.set('port', process.env.PORT || 3000);

// Home page
app.get('/', (request, response) => {
	response.render('index.html', {
		page: 'home',
		port: app.get('port')
	});
});

// Other example
app.get('/example', (request, response) => {
	response.render('example.html', {
		page: 'example',
		port: app.get('port')
	});
});

// Kick start our server
app.listen(app.get('port'), () => {
	console.log('Server ready on port', app.get('port'));
});
