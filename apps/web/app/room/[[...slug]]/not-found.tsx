import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-2xl font-semibold">Room Not Found !!</h2>
      <p className="text-2xl font-semibold">
        Sorry, the room you are looking for does not exist.
      </p>
      <Link className="border py-2 px-4 rounded-md active:scale-90" href="/dashboard">
        Return DashBoard
      </Link>
    </div>
  );
}
