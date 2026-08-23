"use client";

import { motion } from "motion/react";
import { Room } from "../dashboard/page";
import ChatSection from "./ChatSection";


export default function RoomCard({ room }: {room:Room}) {
 

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
    >
     
      <h3 className="font-medium text-gray-800">{room.slug}</h3>
     

     
    </motion.div>
  );
}