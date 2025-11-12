import React from 'react';
import { useProfile } from '../../lib/queries/useAuth';
import { redirect } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};
export default function AdminGuard({ children }: Props) {
  const { data, isRenter } = useProfile();
  console.log(isRenter);

  if (!data || (data && isRenter)) {
    redirect('/404');
    return <p>404</p>;
  }

  return <div>{children}</div>;
}
