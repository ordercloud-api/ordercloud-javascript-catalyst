import express from 'express';
import { withOcUserAuth } from '@ordercloud/catalyst';
import { Me, } from 'ordercloud-javascript-sdk';
import { FullDecodedToken } from '@ordercloud/catalyst/dist/Types/ExtendedToken';

var router = express.Router();

router.get('/api/user', 
    // verifies the request includes an active OrderCloud bearer token
    withOcUserAuth(
        getUserHandler,
        ["Shopper"], // only tokens with Shopper security role may access
        ["Buyer", "Seller"], // only tokens with user type Buyer may access 
    )
);

async function getUserHandler(req, res, next) {
    var token: FullDecodedToken = req.ocToken;
    try {
        var user = await Me.Get({ accessToken: token.raw });
        res.json(user).status(200);
    } catch (err) {
        next(err);
    }
}

export default router;
