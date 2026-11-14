import { Suspense } from "react";
import getUserById from "@/actions/getUserById";
import AdminUserEditForm from "@/components/AdminUserEditForm";

interface IParams {
  userId: string;
}

export default function Page({ params }: { params: Promise<IParams> }) {
  return (
    <Suspense fallback={<div role="status">Loading user...</div>}>
      <UserPage params={params} />
    </Suspense>
  );
}

async function UserPage({ params }: { params: Promise<IParams> }) {
  const { userId } = await params;
  const user = await getUserById({ userId });

  if (!user) {
    return null;
  }

  return (
    <AdminUserEditForm
      name={user.name}
      image={user.image as string}
      userId={user.id}
      email={user.email as string}
    />
  );
}
