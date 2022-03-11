import 'dotenv/config'
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import checkout from './routes/CheckoutIntegrationEvents';
import { CatalystGlobalErrorHandler } from './errors/GlobalErrorHandler';
import { NotFoundError } from './errors/CatalystErrors';
var port = 3000;

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
