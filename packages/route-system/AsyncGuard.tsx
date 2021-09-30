import React, { ComponentType, FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { noop } from '../util';

interface AsyncGuardProps {
  redirect?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  failComponent?: ComponentType<any>;
  guard?: () => boolean | Promise<boolean>;
}

export const AsyncGuard: FC<AsyncGuardProps> = ({
  redirect = '/',
  failComponent: FailComp,
  guard,
  children,
}) => {
  const history = useHistory();
  const [end, setEnd] = useState<boolean | null>(guard ? null : true);

  useEffect(() => {
    if (end || !guard) {
      return noop;
    }

    const handleAsync = (res: boolean) => {
      if (res) {
        setEnd(true);
        return;
      }
      if (FailComp) {
        setEnd(false);
      } else {
        history.replace(redirect);
      }
    };
    Promise.resolve(0)
      .then(guard)
      .then(handleAsync)
      .catch(() => handleAsync(false));

    return noop;
  }, [end, FailComp, history, redirect, guard]);

  if (end === false && FailComp) {
    return <FailComp />;
  }

  if (!end) {
    return null;
  }

  return <>{children}</>;
};
