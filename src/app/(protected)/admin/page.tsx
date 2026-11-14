import { auth } from "@/auth";
import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";

const AdminPage = async () => {
  const session = await getSession();
  const user = session?.user;
  console.log(session);
  console.log(session?.user.id);
  if (!user) {
    redirect("/login");
  }
  if (session?.user?.role !== "ADMIN") {
    return <div>No eres administrador</div>;
  }

  return (
    <div className="container text-black">
      <pre>{JSON.stringify(session, null, 2)}</pre>
     
    </div>
  );
};
export default AdminPage;
