import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import usersRoute from './handlers/users';
import productsRoute from './handlers/products';
import ordersRoute from './handlers/orders';
import orderProductRoute from './handlers/order_product';

const app: express.Application = express();
const address = '0.0.0.0:3000';

app.use(bodyParser.json());

app.get('/', function (_req: Request, res: Response) {
  res.send('Hello World!');
});
app.use('/api', usersRoute, productsRoute, ordersRoute, orderProductRoute);

// usersRoute(app);
// productsRoute(app);
// ordersRoute(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
