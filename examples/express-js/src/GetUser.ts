import express from 'express';
import { withOCUserAuth } from '@ordercloud/catalyst';

var router = express.Router();

router.get('/user', withOCUserAuth(async function(req, res, next) {
    res.body({ ok: "yes"}).status(200);
}));


export default router;
