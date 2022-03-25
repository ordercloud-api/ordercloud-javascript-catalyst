import { withErrorHandledOcUserAuth } from '@ordercloud/catalyst';
import type { NextApiResponse } from 'next'
import { Configuration, Me, MeUser } from 'ordercloud-javascript-sdk';
import { FullDecodedToken } from '../../../../dist/Types/ExtendedToken';
import { NextApiRequestTyped } from '../../Types/NextApiRequestTyped';

// Can put this in a different file
Configuration.Set({
    baseApiUrl: "https://sandboxapi.ordercloud.io"
});

// withErrorHandledOcUserAuth verfies the header "x-oc-hash" matches the hashKey
// use withOcUserAuth if you want to catch errors yourself
export default withErrorHandledOcUserAuth( 
    getUserHandler,
    ["Shopper"], // only tokens with Shopper security role may access
    ["Buyer"] // only tokens with user type Buyer may access 
);

// Route handler
async function getUserHandler(
  req: NextApiRequestTyped<null>, 
  res: NextApiResponse<MeUser>
): Promise<void> {
    // req.ocToken property added by withErrorHandledOcUserAuth
    var token: FullDecodedToken = (req as any).ocToken;
    var user = await Me.Get({ accessToken: token.raw });
    res.status(200).json(user)
}


