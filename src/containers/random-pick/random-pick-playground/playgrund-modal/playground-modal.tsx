import Modal from 'react-modal';
import {
  useRandomPickPlaygroundAction,
  useRandomPickPlaygroundState,
} from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.hooks';

import SetPickNumberModal from './modal-set-picknumber/modal-set-picknumber';
import ResultModal from './modal-result/modal-result';
import { MODAL_STATE_TYPES } from '../../random-pick-playground-provider.tsx/random-pick-playground-provider.constans';

const overlay: React.CSSProperties = {
  backgroundColor: ' rgba(0, 0, 0, 0.4)',
  width: '100%',
  height: '100vh',
  zIndex: '10',
  position: 'fixed',
  top: '0',
  left: '0',
};
const content: React.CSSProperties = {
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
};

export default function PlaygroundModal() {
  const { modalState } = useRandomPickPlaygroundState();
  const { selectModalState } = useRandomPickPlaygroundAction();

  const customModalStyles: ReactModal.Styles = {
    overlay,
    content:
      modalState === MODAL_STATE_TYPES.resultModal
        ? { ...content, height: '400px', width: '800px' }
        : content,
  };

  return (
    <Modal
      isOpen={modalState !== MODAL_STATE_TYPES.noModal}
      onRequestClose={() => selectModalState(MODAL_STATE_TYPES.noModal)}
      style={customModalStyles}
      ariaHideApp={false}
      contentLabel="Pop up Message"
      shouldCloseOnOverlayClick
    >
      {modalState === MODAL_STATE_TYPES.setPickNumberModal && (
        <SetPickNumberModal />
      )}
      {modalState === MODAL_STATE_TYPES.resultModal && <ResultModal />}
    </Modal>
  );
}
