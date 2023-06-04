import axios from 'axios';
import {Config} from '~/config';
import {CreditCard, Retailer, TransactionListItem, User} from '~/domain';
import qs from 'qs';

const axiosInstance = axios.create({baseURL: Config.APP_API_URL});

export const apiClient = {
  login: async (args: {username: string; password: string}) => {
    const response = (await axiosInstance.post('/api/login', args)).data as {
      token: string;
    };
    return response;
  },
  deleteCreditCard: async ({id}: {id: number}) => {
    return await axiosInstance.delete(`/api/creditcard/${id}`);
  },
  addCreditCard: async (args: {
    cv2: string;
    cardNumber: string;
    ownerId: number;
    expires: string;
  }) => {
    const response = (await axiosInstance.post('/api/creditcard', args))
      .data as {
      card: CreditCard;
    };

    return response;
  },
  getRetailerCreditCards: async ({retailerId}: {retailerId: number}) => {
    const response = (await axiosInstance.get(`/api/creditcards/${retailerId}`))
      .data as {creditCards: CreditCard[]};
    return response;
  },
  getRetailerDetails: async ({id}: {id: number}) => {
    const response = (await axiosInstance.get(`/api/retailer/${id}`)).data as {
      retailer: Retailer;
    };

    return response;
  },
  getRetailers: async ({page, pageSize}: {page: number; pageSize: number}) => {
    const response = (
      await axiosInstance.get(
        `/api/retailers?${qs.stringify({
          page,
          pagesize: pageSize,
        })}`,
      )
    ).data as {total: number; retailers: Retailer[]};

    return response;
  },
  getProfile: async () => {
    const response = (await axiosInstance.get('/api/profile')).data as {
      user: User;
    };

    return response;
  },
  getRetailerTransactions: async ({retailerId}: {retailerId: number}) => {
    const response = (
      await axiosInstance.get(
        `/api/transactions?${qs.stringify({
          retailerids: retailerId,
        })}`,
      )
    ).data as {total: number; transactions: TransactionListItem[]};
    return response;
  },
  searchRetailers: async ({search}: {search: string}) => {
    const response = (
      await axiosInstance.get(
        `/api/retailers?${qs.stringify({
          page: 1,
          pagesize: 100,
          search,
        })}`,
      )
    ).data as {total: number; retailers: Retailer[]};
    return response;
  },
  updateProfile: async (args: {
    firstName: string;
    lastName: string;
    email: string;
  }) => {
    await axiosInstance.put('/api/profile', args);
  },
  getTransactions: async ({
    page,
    type,
    filter,
    pageSize,
  }: {
    page: number;
    pageSize: number;
    type: 'ACTIVE' | 'FINISHED';
    filter: {
      minStart: string | null;
      maxStart: string | null;
      retailerIds: number[] | null;
    } | null;
  }) => {
    const response = (
      await axiosInstance.get(
        `/api/transactions?${qs.stringify(
          {
            page,
            pagesize: pageSize,

            statuses: (type === 'ACTIVE'
              ? ['PENDING', 'REJECTED']
              : ['FINISHED']
            ).join('|'),
            retailerids: filter?.retailerIds
              ? filter.retailerIds.join('|')
              : null,
            minstart: filter?.minStart
              ? getTimeOfDay(filter.minStart, 0, 0)
              : null,
            maxstart: filter?.maxStart
              ? getTimeOfDay(filter.maxStart, 23, 59)
              : null,
          },
          {skipNulls: true},
        )}`,
      )
    ).data as {total: number; transactions: TransactionListItem[]};
    return response;
  },
};

const getTimeOfDay = (v: string, hours: number, minutes: number) => {
  const date = new Date(v);
  date.setHours(hours);
  date.setMinutes(minutes);
  return date.getTime();
};
