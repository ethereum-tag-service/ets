import { request } from 'graphql-request';
import { endpointsByChainId } from '../constants/endpoints';

export const fetcher = query => request(endpointsByChainId[80001], query);
