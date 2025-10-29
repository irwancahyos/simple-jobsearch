import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
  return (
    <div>
      <h1>Not use for now</h1>
    </div>
  );
}
