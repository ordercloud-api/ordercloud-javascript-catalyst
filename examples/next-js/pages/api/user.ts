import { withOcErrorHandler, withOCUserAuth } from '@ordercloud/catalyst';
import type { NextApiResponse } from 'next'
import { Configuration, Me, MeUser } from 'ordercloud-javascript-sdk';
import { FullDecodedToken } from '../../../../dist/Types/ExtendedToken';
import { NextApiRequestTyped } from '../../Types/NextApiRequestTyped';

// Can put this in a different file
Configuration.Set({
    baseApiUrl: "https://sandboxapi.ordercloud.io"
});

export default 
  // withOcErrorHandler catches thrown errors and formats them matching OrderCloud.
  withOcErrorHandler(
    // 
    withOCUserAuth(
      getUserHandler
    )
  );

// Route handler
async function getUserHandler(
  req: NextApiRequestTyped<null>, 
  res: NextApiResponse<MeUser>
): Promise<void> {
    var token: FullDecodedToken = (req as any).ocToken;
    console.log(token);
    var user = await Me.Get({ accessToken: token.raw });
    res.status(200).json(user)
}


