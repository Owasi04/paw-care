"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Welcome, {session.user?.name || "User"}!
      </h1>
      <p className="mt-2 text-sm text-gray-600">
        Signed in as {session.user?.email}
      </p>
      <p className="mt-6">HEllo from user Dashboard</p>
    </div>
  );
};

export default Dashboard;
