import { NextApiHandler } from "next"
import { useOCWebhookAuth } from "ordercloud-javascript-catalyst";
import { apiHandler } from "../../../helpers/api/ApiHander"

export const config = {
  api: {
    bodyParser: false,
  },
}

const ShippingRatesHandler: NextApiHandler = (req, res) => {
  res.status(200).send("ok")
}

export default apiHandler({
  post: useOCWebhookAuth(ShippingRatesHandler, process.env.OC_HASH_KEY)
});



