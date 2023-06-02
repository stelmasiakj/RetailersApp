import axios from 'axios';
import {Config} from '~/config';

export const apiClient = axios.create({baseURL: Config.APP_API_URL});
