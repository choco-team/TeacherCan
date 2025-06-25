type Props = {
  link: {
    id: number;
    link: string;
    description: string;
  };
};

export default function LinkCard({ link }: Props) {
  return (
    <>
      <div>{link.link}</div>
      <div>{link.description}</div>
    </>
  );
}
