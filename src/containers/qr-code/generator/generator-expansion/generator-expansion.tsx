'use client';

import { useState } from 'react';
import { Button } from '@/components/button';
import { ZoomIn } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Modal from '../generator-components/generator-modal';

function QRCodeExtansion({ qrCodeValue }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      <Button
        variant="gray-ghost"
        className="size:icon"
        onClick={handleOpenModal}
      >
        <ZoomIn width={30} height={30} />
      </Button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="flex justify-center">
          {qrCodeValue && (
            <QRCodeSVG value={qrCodeValue} width={300} height={300} />
          )}
        </div>
      </Modal>
    </div>
  );
}

export default QRCodeExtansion;
