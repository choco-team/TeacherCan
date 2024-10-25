import Modal from 'react-modal';
import { useCallback } from 'react';
import { useRandomPickPlaygroundState } from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';

import SetPickNumberModal from './modal-set-picknumber/modal-set-picknumber';
import ResultModal from './modal-result/modal-result';

const customModalStyles: ReactModal.Styles = {
  overlay: {
    backgroundColor: ' rgba(0, 0, 0, 0.4)',
    width: '100%',
    height: '100vh',
    zIndex: '10',
    position: 'fixed',
    top: '0',
    left: '0',
  },
  content: {
    width: '400px',
    height: '200px',
    zIndex: '150',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.25)',
    backgroundColor: 'white',
    justifyContent: 'center',
    overflow: 'auto',
  },
};

export default function PlaygroundModal() {
  const { isModalOpen, isResultModal } = useRandomPickPlaygroundState();
  const onRequestClose = useCallback(() => {}, []);
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={onRequestClose}
      style={customModalStyles}
      ariaHideApp={false}
      contentLabel="Pop up Message"
      shouldCloseOnOverlayClick={false}
    >
      {isResultModal ? <ResultModal /> : <SetPickNumberModal />}
    </Modal>
  );
}
