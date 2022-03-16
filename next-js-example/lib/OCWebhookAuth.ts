import { NextApiRequest, NextApiResponse } from 'next';
import { isOCHashValid, WebhookUnauthorizedError } from 'ordercloud-javascript-catalyst';


export function useOCWebhookAuth(routeHandler: (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>, hashKey?: string):  
  (req: NextApiRequest, res: NextApiResponse) => void | Promise<void> 
{
  return async function(req: NextApiRequest, res: NextApiResponse) {
    var isValid = await isOCHashValid(req, hashKey);
    if (isValid) {
      routeHandler(req, res);
    } else {
      throw new WebhookUnauthorizedError();
    } 
  }
}
