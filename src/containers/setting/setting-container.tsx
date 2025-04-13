import FontSizeSetting from './font-size-setting/font-size-setting';

type Props = {
  initialFontSize: 'small' | 'medium' | 'large';
};

export default function SettingContainer({ initialFontSize }: Props) {
  return (
    <div className="max-w-[600px] mx-auto items-start lg:flex-row">
      <FontSizeSetting initialFontSize={initialFontSize} />
    </div>
  );
}
