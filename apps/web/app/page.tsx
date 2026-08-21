import { prisma } from "@repo/db/prisma";

export default async function Page() {
  

  return (
    <div className="h-screen bg-red-400">
      <h1 className="text-foreground bg-background">Hello World</h1>
      
    </div>
  );
}