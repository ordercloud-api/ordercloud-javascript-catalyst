import { NextApiHandler } from "next"
import { apiHandler } from "../../../helpers/api/ApiHander"
import { NotFoundError } from "../../../lib/CatalystErrors"
import { useOCWebhookAuth } from "../../../lib/OCWebhookAuth";

export const config = {
  api: {
    bodyParser: false,
  },
}

const ShippingRatesHandler: NextApiHandler = (req, res) => {
  throw new NotFoundError()
  res.status(200).send("ok")
}

export default apiHandler({
  post: useOCWebhookAuth(ShippingRatesHandler, process.env.OC_HASH_KEY)
});



