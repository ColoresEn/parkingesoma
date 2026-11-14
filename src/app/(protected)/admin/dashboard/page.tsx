import getSession from "@/lib/getSession";


export default async function DashboardPage() {
  const session = await getSession();
  const user = session?.user;
  console.log(session);
  console.log(session?.user.id);

  if (!session) {
    return <div>No te has autenticado</div>;
  }

  return (
    <div className="container text-black">
      <pre>{JSON.stringify(session, null, 2)}</pre>
   
    </div>
  );
}
