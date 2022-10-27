import {PropsWithChildren} from 'react';

interface TailwindClassOverride {
  className?: string;
}

interface PageTitleProps extends TailwindClassOverride {
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
}

export const PageTitle = ({
  type: Type = 'h1',
  className,
  children,
}: PropsWithChildren<PageTitleProps>) => {
  return (
    <Type
      className={`tracking-tight font-extrabold text-3xl my-4 ${
        className ? className : ''
      }`}
    >
      {children}
    </Type>
  );
};
