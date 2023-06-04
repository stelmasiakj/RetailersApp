import express, {Request, Response} from 'express';
import {fakeDB} from './fake.db';

const app = express();

app.use(express.json());

app.post('/api/login', (_: Request, res: Response) => {
  res.json({token: 'test'});
});

app.get('/api/retailers', (req: Request, res: Response) => {
  const {page, pagesize, search} = req.query;

  let retailers = fakeDB.data.retailers.sort((r1, r2) => {
    const fullName1 = `${r1.firstName} ${r1.lastName}`.toLowerCase();
    const fullName2 = `${r2.firstName} ${r2.lastName}`.toLowerCase();

    return fullName1 > fullName2 ? 1 : fullName1 < fullName2 ? -1 : 0;
  });

  if (search) {
    retailers = retailers.filter(r => {
      const fullName = `${r.firstName} ${r.lastName}`.toLowerCase();
      return fullName.includes((search as string).toLowerCase());
    });
  }

  const total = retailers.length;

  if (typeof page === 'string' && typeof pagesize === 'string') {
    const pageNum = parseInt(page, 10);
    const pageSizeNum = parseInt(pagesize, 10);
    const skip = (pageNum - 1) * pageSizeNum;
    retailers = retailers.slice(skip, skip + pageSizeNum);
  }

  res.json({
    retailers,
    total,
  });
});

app.get('/api/retailer/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const retailer = fakeDB.data.retailers.find(r => r.id === id);
  if (!retailer) {
    throw new Error('user not found');
  }

  res.json({retailer});
});

app.get('/api/profile', (_: Request, res: Response) => {
  const user = fakeDB.data.users[0];

  return res.json({user});
});

app.put('/api/profile', (req: Request, res: Response) => {
  const {firstName, lastName, email} = req.body;
  const user = fakeDB.data.users[0];

  user.email = email;
  user.firstName = firstName;
  user.lastName = lastName;

  res.json({updated: true});
});

app.get('/api/transactions', (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string, 10) : null;
  const pageSize = req.query.pagesize
    ? parseInt(req.query.pagesize as string, 10)
    : null;
  const minStart = req.query.minstart
    ? new Date(parseInt(req.query.minstart as string, 10))
    : null;
  const maxStart = req.query.maxstart
    ? new Date(parseInt(req.query.maxstart as string, 10))
    : null;
  const statuses = req.query.statuses
    ? (req.query.statuses as string).split('|')
    : null;
  const retailerIds = req.query.retailerids
    ? (req.query.retailerids as string).split('|')
    : null;

  let transactions = fakeDB.data.transactions.sort((t1, t2) => {
    const createDate1 = new Date(t1.createDate);
    const createDate2 = new Date(t2.createDate);

    return createDate2.getTime() - createDate1.getTime();
  });

  if (minStart) {
    transactions = transactions.filter(t => new Date(t.createDate) >= minStart);
  }
  if (maxStart) {
    transactions = transactions.filter(t => new Date(t.createDate) <= maxStart);
  }
  if (statuses) {
    transactions = transactions.filter(t => statuses.includes(t.status));
  }
  if (retailerIds) {
    transactions = transactions.filter(t => {
      return retailerIds.includes(t.retailerId);
    });
  }

  const total = transactions.length;
  if (typeof page === 'number' && typeof pageSize === 'number') {
    const skip = (page - 1) * pageSize;
    transactions = transactions.slice(skip, skip + pageSize);
  }

  res.json({
    transactions: transactions.map(
      ({amount, createDate, retailerId, status, updateDate, id}) => ({
        amount,
        createDate,
        status,
        updateDate,
        id,
        retailerFirstName: fakeDB.data.retailers.find(r => r.id === retailerId)!
          .firstName,
        retailerLastName: fakeDB.data.retailers.find(r => r.id === retailerId)!
          .lastName,
      }),
    ),
    total,
  });
});

app.get('/api/creditcards/:userId', (request, response) => {
  const {userId} = request.params;
  const creditCards = fakeDB.data.creditCards.filter(
    c => c.retailerId === userId,
  );

  return response.json({creditCards});
});

app.post('/api/creditcard', (req, res) => {
  const body = req.body;
  const cv2: string = body.cv2;
  const cardNumber: string = body.cardNumber;
  const ownerId: string = body.ownerId;
  const expires: string = body.expires;

  const id = (
    Math.max(...fakeDB.data.creditCards.map(c => parseInt(c.id, 10))) + 1
  ).toString();

  const retailer = fakeDB.data.retailers.find(r => r.id === ownerId)!;

  retailer?.creditCardIds.push(id);

  const card = {
    cv2,
    lastFourDigits: cardNumber.slice(cardNumber.length - 4),
    expires,
    retailerId: ownerId,
    id,
  };

  fakeDB.data.creditCards.push(card);

  res.json({card});
});

app.delete('/api/creditcard/:id', (req, res) => {
  const {id} = req.params;
  fakeDB.data.creditCards = fakeDB.data.creditCards.filter(c => c.id !== id);

  res.json({deleted: true});
});

let server: ReturnType<typeof app.listen>;

const startListening = async () => {
  return new Promise<void>(resolve => {
    server = app.listen(26789, () => {
      // eslint-disable-next-line no-console
      console.log('fakeServer is listening');
      resolve();
    });
  });
};

const stopListening = async () => {
  return new Promise<void>(resolve => {
    if (server) {
      server.close(() => {
        // eslint-disable-next-line no-console
        console.log('fakeServer is closing');
        resolve();
      });
    }
  });
};

const reloadFakeDB = () => {
  fakeDB.reload();
};

export const fakeServer = {startListening, stopListening, reloadFakeDB};
