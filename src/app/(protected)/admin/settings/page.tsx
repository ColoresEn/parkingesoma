import { Suspense } from "react";
import { Metadata } from "next";
import avatarPlaceholder from "@/assets/images/avatar_placeholder.png";
import { redirect } from "next/navigation";
import UserEditForm from "@/components/UserEditForm";
import Image from "next/image";
import getCurrentUser from "@/actions/getCurrentUser";
export const metadata: Metadata = {
  title: "Profile"
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="page-frame section-page" role="status">
          Loading profile...
        </main>
      }
    >
      <ProfilePage />
    </Suspense>
  );
}

async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {currentUser?.name && (
        <div className="row">
          <div className="flex w-full md:my-6 md:max-w-2xl md:px-2 lg:max-w-4xl">
            <div className="relative flex w-full items-center overflow-hidden rounded-md  px-4 pt-5   sm:px-4  md:p-6 lg:p-8">
              <div className="flex min-h-full items-stretch justify-center  text-center md:items-center md:px-2 lg:px-4">
                <div className="grid w-full grid-cols-1 items-start gap-y-8 gap-x-6 sm:grid-cols-12 lg:gap-x-8">
                  <div className="aspect-w-2 aspect-h-3 overflow-hidden rounded-lg sm:col-span-4 lg:col-span-5 mx-auto border-gray-900 shadow-md shadow-black">
                    <Image
                      src={currentUser?.image || avatarPlaceholder}
                      alt={currentUser?.name}
                      width={200}
                      height={200}
                      priority
                       className="w-auto h-auto object-cover object-center "
                    />
                  </div>
                  <div className="sm:col-span-8 lg:col-span-7 ">
                    <div className="flex ">
                      <h3 className="text-2xl font-bold text-white sm:pr-12 mb-3">
                      <span>Name:</span>   {currentUser?.name}{" "}
                      </h3>
                      </div>
                      <p>
                        {" "}
                        <span>Email:</span> {currentUser.email}
                      </p>
                      <p className="my-2">
                        <span className="mr-1 ">Desde:</span>
                        {new Date(currentUser.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        {" "}
                        <span className="mr-1 ">Id:</span> {currentUser.id}
                      </p>
                      <div className="mt-8">
                      <UserEditForm
                        name={currentUser?.name}
                        image={currentUser?.image as string}
                        userId={currentUser?.id}
                        email={currentUser?.email as string}
                      />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
       
      )}
    </div>
  );
}
