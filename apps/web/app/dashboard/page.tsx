"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiInstance } from "../../config";
import RoomCard from "../../components/RoomCard";

import Link from "next/link";

export interface Room {
  id: number;
  userId: number;
  slug: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [createRoomError, setCreateRoomError] = useState("");

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

  const handleCreateRoom = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateRoomError("");
    setIsCreatingRoom(true);

    try {
      await apiInstance.post("/create-room", { roomName: roomName.trim() });
      setRoomName("");
      setIsCreateRoomOpen(false);
      await fetchRooms();
    } catch (err) {
      console.error("create-room api failed", err);
      setCreateRoomError("Unable to create room. Please try again.");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">All Rooms</h1>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setCreateRoomError("");
              setIsCreateRoomOpen(true);
            }}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Create room
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading rooms...</p>
      ) : rooms.length === 0 ? (
        <p className="text-gray-500 text-sm">No rooms found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <Link key={room.id} href={`/room/${room.slug}`}>
              <RoomCard room={room} />
            </Link>
          ))}
        </div>
      )}

      {isCreateRoomOpen && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 px-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isCreatingRoom) {
              setIsCreateRoomOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-room-title"
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2
                  id="create-room-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  Create a room
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Choose a name for your new room.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close create room dialog"
                onClick={() => setIsCreateRoomOpen(false)}
                disabled={isCreatingRoom}
                className="text-2xl leading-none text-gray-400 hover:text-gray-700 disabled:cursor-not-allowed"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label
                  htmlFor="room-name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Room name
                </label>
                <input
                  id="room-name"
                  type="text"
                  value={roomName}
                  onChange={(event) => setRoomName(event.target.value)}
                  required
                  autoFocus
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="e.g. Design review"
                />
              </div>

              {createRoomError && (
                <p className="text-sm text-red-600">{createRoomError}</p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateRoomOpen(false)}
                  disabled={isCreatingRoom}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingRoom}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  {isCreatingRoom ? "Creating..." : "Create room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
