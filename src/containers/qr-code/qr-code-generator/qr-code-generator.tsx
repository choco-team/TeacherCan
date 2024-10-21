import { QRCodeSVG } from 'qrcode.react';
import TeacherCanLogo from '@/assets/images/logo/teacher-can.svg';
import { Heading2 } from '@/components/heading';
import { Input } from '@/components/input';
import { useCallback, useState, CSSProperties } from 'react';
// import { Loader } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import debounce from './qr-code-generator-debounce';

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  borderColor: 'red',
};

function QRCodeGenerator({
  setQrCodeValue,
  qrCodeRef,
  qrCodeValue,
  qrCodeName,
  setQrCodeName,
  isGenerated,
  setIsGenerated,
}) {
  const [newValue, setNewValue] = useState('');
  const [loading, setLoading] = useState(false);
  const debounceGenerate = useCallback(
    debounce((value: string) => {
      setIsGenerated(true);
      setQrCodeValue(value);
      setQrCodeName('');
      setLoading(false);
    }, 1000),
    [],
  );

  const handleGenerate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewValue(value);
    debounceGenerate(value);
    setLoading(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrCodeName(e.target.value);
  };

  const handleQRNameFocus = () => {
    setQrCodeName('');
  };

  return (
    <div>
      <Heading2 className="text-center text-2xl font-semibold mb-4">
        QR 코드 생성
      </Heading2>
      <div className="flex justify-center">
        <Input
          type="text"
          value={newValue}
          onChange={handleGenerate}
          placeholder="주소를 입력하세요"
          className="flex-grow w-3/4"
        />
      </div>
      <div className="flex justify-center mt-4">
        <Input
          type="text"
          value={qrCodeName}
          onChange={handleNameChange}
          onFocus={handleQRNameFocus}
          placeholder="QR 코드 이름을 입력하세요"
          className="flex-grow w-3/4"
        />
      </div>
      <div className="flex justify-center mt-4">
        <ClipLoader
          color="#E50915"
          loading={loading}
          cssOverride={override}
          size={80}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>

      {isGenerated && !loading && (
        <div className="flex justify-center">
          <div ref={qrCodeRef}>
            <QRCodeSVG
              value={qrCodeValue}
              width={200}
              height={200}
              className="mt-8"
              fgColor="green"
            />
            {qrCodeName && (
              <p className="text-center mt-2 text-lg font-semibold w-full">
                {qrCodeName}
              </p>
            )}
          </div>
        </div>
      )}
      {!isGenerated && !loading && (
        <div className="flex justify-center">
          <TeacherCanLogo
            width="200"
            height="200"
            className="animate-bounce-in-top mt-8"
          />
        </div>
      )}
    </div>
  );
}

export default QRCodeGenerator;
