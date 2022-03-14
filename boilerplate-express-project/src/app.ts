import 'dotenv/config'
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import checkout from './routes/CheckoutIntegrationEvents';
import { CatalystGlobalErrorHandler } from './errors/GlobalErrorHandler';
import { NotFoundError } from './errors/CatalystErrors';
import bodyParser from 'body-parser';

var port = 3000;

var app = express();

// This adds the "rawBody" property to all requests, which is needed for webhook auth.
var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}

app.use(logger('dev'));
app.use(express.json({ verify: rawBodySaver}));

app.use(express.urlencoded({ extended: false, verify: rawBodySaver }));
app.use(cookieParser());

app.use('/api/checkout', checkout);

// Since this is the last non-error-handling
// middleware used, we assume 404, as nothing else responded.
app.use(() => { throw new NotFoundError() });

app.use(CatalystGlobalErrorHandler);

// start the Express server
app.listen( port, () => {
  console.log( `server started at http://localhost:${ port }` );
} );

export default app;
