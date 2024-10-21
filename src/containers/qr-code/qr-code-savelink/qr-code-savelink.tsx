// import { useState, useEffect } from 'react';
// import { Badge } from '@/components/badge';

// export type QRSaveLinksProps = {
//   qrCodeValue: string;
//   setQrCodeValue: (value: string) => void;
//   setIsGenerated: (value: boolean) => void;
// };

// function QRSavedLinks({
//   qrCodeValue,
//   setQrCodeValue,
//   setIsGenerated,
// }: QRSaveLinksProps): JSX.Element {
//   const [savedLinks, setSavedLinks] = useState<string[]>([]);

//   const saveLink = (newLink: string) => {
//     if (newLink && !savedLinks.includes(newLink)) {
//       const newSavedLinks = [...savedLinks];
//       if (newSavedLinks.length === 3) {
//         newSavedLinks.shift();
//       }
//       newSavedLinks.push(newLink);
//       setSavedLinks(newSavedLinks);
//     }
//   };

//   const handleBadgeClick = (link: string) => {
//     setQrCodeValue(link);
//     setIsGenerated(true);
//   };

//   useEffect(() => {
//     if (savedLinks.length > 0) {
//       localStorage.setItem('qr_codes', JSON.stringify(savedLinks));
//     }
//   }, [savedLinks]);

//   useEffect(() => {
//     const storedLinks = localStorage.getItem('qr_codes');
//     if (storedLinks) {
//       setSavedLinks(JSON.parse(storedLinks));
//     }
//   }, []);

//   useEffect(() => {
//     saveLink(qrCodeValue);
//   }, [qrCodeValue]);

//   return (
//     <div className="mt-4 flex justify-center flex-wrap ">
//       {savedLinks.map((link) => (
//         <Badge
//           className="mr-2 ml-2 mt-2 cursor-pointer truncate max-w-xs"
//           onClick={() => handleBadgeClick(link)}
//         >
//           {link}
//         </Badge>
//       ))}
//     </div>
//   );
// }

// export default QRSavedLinks;
