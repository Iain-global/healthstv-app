import LoungeClient from "./LoungeClient";
import "./lounge.css";

export default function LoungePage() {
  return (
    <div className="lounge-body absolute inset-0 w-full min-h-screen bg-[#10161b] overflow-x-hidden">
      <LoungeClient />
    </div>
  );
}
