var crypto = require('crypto-js');
import getRawBody from 'raw-body';

// Defined globaly by the OrderCloud platform
const hashHeader = 'x-oc-hash';

export async function isOCHashValid(req, hashKey: string | undefined): Promise<boolean> {
  if (!req.rawBody) {
    const buffer = await getRawBody(req);
    req.rawBody = buffer.toString();
    req.body = JSON.parse(req.rawBody);
  }

  const sent = Array.isArray(req.headers[hashHeader])
    ? req.headers[hashHeader][0]
    : req.headers[hashHeader]


  if (!hashKey || !sent) {
    return false;
  }

  var sha256 = crypto.HmacSHA256(req.rawBody, hashKey);
  var hash = crypto.enc.Base64.stringify(sha256);
  
  return hash === sent;
}
