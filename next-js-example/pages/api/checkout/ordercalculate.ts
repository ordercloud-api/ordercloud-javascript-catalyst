// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { apiHandler } from '../../../helpers/api/apiHander';
import { WebhookUnauthorizedError } from '../../../types/CatalystErrors';

export default apiHandler({
    post: OrderCalculate
});

function OrderCalculate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({ name: 'John Doe' })
}