require('dotenv').config({path: '.env'});
const http = require('http');
const helmet = require('helmet');
const hpp = require('hpp');
//const session = require('express-session')

//const cookieSession = require('cookie-session')

const app = require('./app');




/* const expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'localhost',
    expires: expiryDate
  }
})) */







/* app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'motS De pasSe sessiOns',
  name: 'sessionId'
})) */



app.use(hpp());
app.use(helmet());

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || 4000);
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

app.disable('x-powered-by');

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// custom 404
app.use((req, res, next) => {
  res.status(404).send("Désolé nous n'avons pas trouvé cette page!")
})

// custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Quelque chose s'est cassé.")
})


server.listen(port);


