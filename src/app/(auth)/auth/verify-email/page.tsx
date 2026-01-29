import { Suspense } from 'react';
import VerifyEmail from '../../../../components/auth/VerifyEmail';
import { CustomLoading } from '../../../../hooks/CustomLoading';

const page = () => {
  return (
    <Suspense fallback={<CustomLoading />}>
      <VerifyEmail />
    </Suspense>
  );
};

export default page;