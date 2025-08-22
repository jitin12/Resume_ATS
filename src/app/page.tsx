"use client";
import upload from "../../backend/mongodb";
import { signIn, signOut, useSession } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();
  
  return (
    <nav>
      {session ? (
        
        <>
          <span>Welcome, {session.user?.name}</span>
          <button onClick={() => signOut()}>Logout</button>
        </>
      ) : (
        <button onClick={() => signIn("google")}>Login with Google</button>
      )}
    </nav>
  );
}
