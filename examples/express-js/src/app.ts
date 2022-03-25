import 'dotenv/config'
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import checkout from './checkoutIntegrationRoutes';
import getUser from './GetUser';
import { ocErrorResponse, NotFoundError } from '@ordercloud/catalyst';
import { Configuration } from 'ordercloud-javascript-sdk';

Configuration.Set({
  baseApiUrl: "https://sandboxapi.ordercloud.io"
});

// This file sets up the express server.

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
app.use('', getUser);

// Since this is the last non-error-handling
// middleware used, we assume 404, as nothing else responded.
app.use(() => { throw new NotFoundError() });

// Global error handling. Converts thrown Error objects into standardized json repsonses. 
app.use((err, req, res, next) => {
  console.log("here");
  ocErrorResponse(err, res)
});

// start the Express server
app.listen( port, () => {
  console.log( `server started at http://localhost:${ port }` );
} );

export default app;
