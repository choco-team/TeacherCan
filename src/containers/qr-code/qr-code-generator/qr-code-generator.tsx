import { QRCodeSVG } from 'qrcode.react';
import TeacherCanLogo from '@/assets/images/logo/teacher-can.svg';
import { Heading2 } from '@/components/heading';
import { Input } from '@/components/input';
import { useCallback, useState } from 'react';
import theme from '@/styles/theme';
import debounce from './qr-code-generator-debounce';

const loaderStyle = `
.loader {
    width: 48px;
    height: 48px;
    border: 5px solid ${theme.colors.primary[400]};
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;

    }

    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
    } 
`;

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
      setLoading(false);
    }, 500),
    [],
  );

  const handleGenerate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewValue(value);
    setLoading(true);
    if (value.trim()) {
      debounceGenerate(value);
    } else {
      setIsGenerated(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrCodeName(e.target.value);
  };

  return (
    <div>
      <style>{loaderStyle}</style>
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
          placeholder="QR 코드 이름을 입력하세요"
          className="flex-grow w-3/4"
          maxLength={12}
        />
      </div>
      <div className="flex justify-center mt-4">
        {loading && <span className="loader mt-8" />}
      </div>

      {isGenerated && !loading && (
        <div className="flex justify-center">
          <div ref={qrCodeRef}>
            <QRCodeSVG
              value={qrCodeValue}
              width={200}
              height={200}
              className="mt-8"
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
