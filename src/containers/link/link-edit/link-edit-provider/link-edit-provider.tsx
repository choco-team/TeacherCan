import { useGetLinks } from '@/hooks/apis/link/use-get-links';
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

interface PropsWithChildrenParams extends PropsWithChildren {
  code: string;
}

type Link = {
  id: number;
  link: string;
  description: string;
};

type LinkEditState = {
  links: Link[];
  linkCode: string;
};

export const LinkEditStateContext = createContext<LinkEditState | null>(null);

type LinkEditAction = {
  settingLinks: Dispatch<SetStateAction<Link[]>>;
};

export const LinkEditActionContext = createContext<LinkEditAction | null>(null);

export default function LinkEditProvider({
  children,
  code,
}: PropsWithChildrenParams) {
  const { data } = useGetLinks(code);
  const [links, setLinks] = useState([]);
  const [linkCode] = useState(code);

  useEffect(() => {
    if (data?.data?.links) {
      setLinks([...data.data.links]);
    }
  }, [data]);

  const defaultLinkEditStateValue = {
    links,
    linkCode,
  };

  const defaultLinkEditActionValue = {
    settingLinks: setLinks,
  };

  return (
    <LinkEditStateContext.Provider value={defaultLinkEditStateValue}>
      <LinkEditActionContext.Provider value={defaultLinkEditActionValue}>
        {children}
      </LinkEditActionContext.Provider>
    </LinkEditStateContext.Provider>
  );
}
