
"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiInstance } from "../../config";
import RoomCard from "../components/RoomCard";


import Link from "next/link";


export interface Room {
  id:number;
  userId: number;
  slug: string;
}



export default function Dashboard() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
  
    fetchRooms();
   
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await apiInstance.get<{ data: Room[] }>(`/allrooms`);
      const data = res.data.data;
      setRooms(data);
    } catch (err) {
      console.log("allrooms api failed, using fallback data", err);
     
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // make a api call for logging out user
    // clear cookie
    router.push("/");
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">All Rooms</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <p className="text-gray-500 text-sm">No rooms found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          { rooms.map((room) => (
            <Link key={room.userId} href={`/${room.slug}`}>
              <RoomCard room={room} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}