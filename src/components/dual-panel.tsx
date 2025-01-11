'use client';

import {
  ComponentPropsWithoutRef,
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { cva } from 'class-variance-authority';
import { X as XIcon } from 'lucide-react';
import { cn } from '@/styles/utils';

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;

type DualPanelType = {
  isOpen: boolean;
  side: 'top' | 'bottom' | 'left' | 'right';
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const DualPanelContext = createContext<DualPanelType | null>(null);

type DualPanelProviderProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  side?: 'top' | 'bottom' | 'left' | 'right';
};

function DualPanelProvider(props: DualPanelProviderProps) {
  const { children, ...rest } = props;

  const [isOpen, setIsOpen] = useState(rest.defaultOpen ?? false);

  return (
    <DualPanelContext.Provider
      value={{
        isOpen,
        setIsOpen,
        side: rest.side ?? 'right',
      }}
    >
      {children}
    </DualPanelContext.Provider>
  );
}

type Props = {
  children: ReactNode;
  defaultOpen?: boolean;
  side?: 'top' | 'bottom' | 'left' | 'right';
};

function DualPanelRoot({ defaultOpen, side, children }: Props) {
  return (
    <DualPanelProvider defaultOpen={defaultOpen} side={side}>
      {children}
    </DualPanelProvider>
  );
}

const mainVariants = cva(
  'transition-all data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'data-[state=open]:mt-[24rem]',
        bottom: 'data-[state=open]:mb-[24rem]',
        left: 'data-[state=open]:ml-[24rem]',
        right: 'data-[state=open]:mr-[24rem]',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

type MainProps = ComponentPropsWithoutRef<'div'>;

function Main({ children, ...rest }: MainProps) {
  const { isOpen, side } = useContext(DualPanelContext);

  return (
    <div
      data-state={isOpen ? 'open' : 'closed'}
      className={mainVariants({ side })}
      {...rest}
    >
      {children}
    </div>
  );
}

function Side({ children }: { children: ReactNode }) {
  const { isOpen, setIsOpen } = useContext(DualPanelContext);

  return (
    <Sheet
      defaultOpen={isOpen}
      open={isOpen}
      onOpenChange={setIsOpen}
      modal={false}
    >
      {children}
    </Sheet>
  );
}

const sheetVariants = cva(
  'fixed z-50 gap-4 bg-background px-6 py-8 overflow-scroll shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500',
  {
    variants: {
      side: {
        top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        bottom:
          'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
        right:
          'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      },
    },
    defaultVariants: {
      side: 'right',
    },
  },
);

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ className, children, ...props }, ref) => {
  const { side } = useContext(DualPanelContext);

  return (
    <SheetPortal>
      <SheetPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        onOpenAutoFocus={
          props.onOpenAutoFocus ??
          ((event) => {
            event.preventDefault();
          })
        }
        onInteractOutside={(event) => {
          event.preventDefault();
        }}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute right-6 top-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <XIcon className="size-6" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = SheetPrimitive.Content.displayName;

function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col text-center sm:text-left', className)}
      {...props}
    />
  );
}
SheetHeader.displayName = 'SheetHeader';

function SheetFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className,
      )}
      {...props}
    />
  );
}
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-2xl font-bold text-foreground leading-none', className)}
    {...props}
  />
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetSubTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ children, className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold text-foreground leading-none',
      'flex items-center gap-x-2',
      '[&_svg]:size-5',
      className,
    )}
    {...props}
  >
    {children}
  </h3>
));
SheetSubTitle.displayName = 'SheetSubTitle';

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

const DualPanel = {
  Root: DualPanelRoot,
  Main,
  Side,
  Portal: SheetPortal,
  Trigger: SheetTrigger,
  Close: SheetClose,
  Content: SheetContent,
  Header: SheetHeader,
  Footer: SheetFooter,
  Title: SheetTitle,
  SubTitle: SheetSubTitle,
  Description: SheetDescription,
};

export default DualPanel;
