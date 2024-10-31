import Modal from 'react-modal';
import { useCallback } from 'react';
import { useRandomPickPlaygroundState } from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';

import SetPickNumberModal from './modal-set-picknumber/modal-set-picknumber';
import ResultModal from './modal-result/modal-result';
import { MODAL_STATE_TYPES } from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.constans';

export default function PlaygroundModal() {
  const { modalState } = useRandomPickPlaygroundState();
  const onRequestClose = useCallback(() => {}, []);

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
      width: modalState === MODAL_STATE_TYPES.resultModal ? '800px' : '400px',
      height: modalState === MODAL_STATE_TYPES.resultModal ? '400px' : '200px',
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
  return (
    <Modal
      isOpen={modalState !== MODAL_STATE_TYPES.noModal}
      onRequestClose={onRequestClose}
      style={customModalStyles}
      ariaHideApp={false}
      contentLabel="Pop up Message"
      shouldCloseOnOverlayClick={false}
    >
      {modalState === MODAL_STATE_TYPES.setPickNumberModal && (
        <SetPickNumberModal />
      )}
      {modalState === MODAL_STATE_TYPES.resultModal && <ResultModal />}
    </Modal>
  );
}
