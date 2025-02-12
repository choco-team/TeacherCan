export type QRCode = { value: string; name: string };

export type SavedQRCodes = {
  id: string;
  date: string;
  url: string;
  title: string;
}[];
