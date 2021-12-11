import { useMediaQuery } from "@mui/material";

import DesktopProtectedPageLayout from "./DestopVersion";
import MobileProtectedPageLayout from "./MobileVersion";

function ProtectedPageLayout({ children }: { children: React.ReactNode }) {
  const isScreenWidthSmallerThan500Px = useMediaQuery("(max-width:500px)");
  if (isScreenWidthSmallerThan500Px) {
    return <MobileProtectedPageLayout children={children} />;
  }
  return <DesktopProtectedPageLayout children={children} />;
}

export default ProtectedPageLayout;
