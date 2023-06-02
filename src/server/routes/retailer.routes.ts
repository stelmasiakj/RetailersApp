import {Server} from 'miragejs';
import {AppSchema} from '../types';

export function retailerRoutes(server: Server) {
  server.get('/retailers', (schema: AppSchema, request) => {
    const {page, pagesize, search} = request.queryParams;
    let retailers = schema.all('retailer').sort((r1, r2) => {
      const fullName1 = `${r1.firstName} ${r1.lastName}`.toLowerCase();
      const fullName2 = `${r2.firstName} ${r2.lastName}`.toLowerCase();

      return fullName1 > fullName2 ? 1 : fullName1 < fullName2 ? -1 : 0;
    });

    if (search) {
      retailers = retailers.filter(r => {
        const fullName = `${r.firstName} ${r.lastName}`.toLowerCase();
        return fullName.includes(search.toLowerCase());
      });
    }

    const total = retailers.length;

    if (typeof page === 'string' && typeof pagesize === 'string') {
      const pageNum = parseInt(page, 10);
      const pageSizeNum = parseInt(pagesize, 10);
      const skip = (pageNum - 1) * pageSizeNum;
      retailers = retailers.slice(skip, skip + pageSizeNum);
    }

    return {retailers: retailers.models, total};
  });

  server.get('/retailer/:id', (schema: AppSchema, request) => {
    const {id} = request.params;
    const retailer = schema.find('retailer', id);
    if (!retailer) {
      throw new Error('user not found');
    }

    return retailer;
  });
}
