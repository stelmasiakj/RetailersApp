import {Server} from 'miragejs';
import {AppSchema} from '../types';

export function transactionRoutes(server: Server) {
  server.get('/transactions', (schema: AppSchema, request) => {
    const page = request.queryParams.page
      ? parseInt(request.queryParams.page, 10)
      : null;
    const pageSize = request.queryParams.pagesize
      ? parseInt(request.queryParams.pagesize, 10)
      : null;
    const minStart = request.queryParams.minstart
      ? new Date(parseInt(request.queryParams.minstart, 10))
      : null;
    const maxStart = request.queryParams.maxstart
      ? new Date(parseInt(request.queryParams.maxstart, 10))
      : null;
    const statuses = request.queryParams.statuses
      ? request.queryParams.statuses.split('|')
      : null;
    const retailerIds = request.queryParams.retailerids
      ? request.queryParams.retailerids.split('|')
      : null;

    let transactions = schema.all('transaction').sort((t1, t2) => {
      const createDate1 = new Date(t1.createDate);
      const createDate2 = new Date(t2.createDate);

      return createDate2.getTime() - createDate1.getTime();
    });

    if (minStart) {
      transactions = transactions.filter(
        t => new Date(t.createDate) >= minStart,
      );
    }
    if (maxStart) {
      transactions = transactions.filter(
        t => new Date(t.createDate) <= maxStart,
      );
    }
    if (statuses) {
      transactions = transactions.filter(t => statuses.includes(t.status));
    }
    if (retailerIds) {
      transactions = transactions.filter(t => {
        return retailerIds.includes(t.retailer.id as any);
      });
    }

    const total = transactions.length;
    if (typeof page === 'number' && typeof pageSize === 'number') {
      const skip = (page - 1) * pageSize;
      transactions = transactions.slice(skip, skip + pageSize);
    }

    return {
      transactions: transactions.models.map(
        ({
          amount,
          createDate,
          retailer: {firstName, lastName},
          status,
          updateDate,
          id,
        }) => ({
          amount,
          createDate,
          status,
          updateDate,
          id,
          retailerFirstName: firstName,
          retailerLastName: lastName,
        }),
      ),
      total,
    };
  });

  server.patch(
    '/transactions/markasfinished/:id',
    (schema: AppSchema, request) => {
      const {id} = request.params;
      const transaction = schema.find('transaction', id);

      if (!transaction) {
        throw new Error(`transaction with id ${id} not found`);
      }

      transaction.update({status: 'FINISHED'});

      return {updated: true};
    },
    {timing: 50},
  );
}
