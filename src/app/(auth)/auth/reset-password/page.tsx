import { Suspense } from 'react';
import ResetPasswordPage from '../../../../components/auth/ResetPasswordPage';
import { CustomLoading } from '../../../../hooks/CustomLoading';

const page = () => {
  return (
    <Suspense fallback={<CustomLoading />}>
      <ResetPasswordPage />
    </Suspense>
  );
};

export default page;