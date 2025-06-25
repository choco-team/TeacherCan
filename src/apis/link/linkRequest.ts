import { fetcher } from '../fetcher';

type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  data: T;
  message: string;
  timestamp: string; // ISO 형식의 문자열
};

type CreateLinkCodeResponse = {
  code: string;
};

export const createLinkCode = (body: { code: string }) => {
  return fetcher<ApiResponse<CreateLinkCodeResponse>>('/link/code', {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

type CreateLinkResponse = {
  id: number;
  link: string;
  description: string;
};

export const createLink = (body: {
  code: string;
  link: string;
  description: string;
}) => {
  return fetcher<ApiResponse<CreateLinkResponse>>('/link', {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

type Links = {
  id: number;
  link: string;
  description: string;
};

type GetLinksResponse = {
  links: Links[];
};

export const getLinks = (params: { code: string }) => {
  const searchParams = new URLSearchParams(params);
  return fetcher<ApiResponse<GetLinksResponse>>(`/link?${searchParams}`);
};

type DeleteLinkResponse = {
  id: number;
};

export const DeleteLink = (body: { id: number }) => {
  return fetcher<ApiResponse<DeleteLinkResponse>>('/link', {
    method: 'DELETE',
    body: JSON.stringify(body),
  });
};
