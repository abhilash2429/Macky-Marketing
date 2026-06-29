import { LandingPage } from "@/components/landing-page/LandingPage";
import { SmoothCursor } from "../components/ui/smooth-cursor";

export default function App() {
  return (
    <div className="size-full">
      <SmoothCursor />
      <LandingPage />
    </div>
  );
}