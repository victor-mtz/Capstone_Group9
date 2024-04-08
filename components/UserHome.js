import { useMeQuery } from '../utils/api/authSlice';

export default function UserHome() {
  const meData = useMeQuery();
  console.log(meData);
  return <div>Welcome {meData.data?.first_name}!</div>;
}
