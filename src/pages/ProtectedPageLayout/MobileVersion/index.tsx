import { CssBaseline } from "@mui/material";

import ProtectedHeader from "components/ProtectedHeader/MobileVersion";
import MobileProtectedFooter from "components/MobileProtectedFooter";

import { headerHeight } from "components/sharedStyles/headerStyles";
import { footerHeight } from "components/sharedStyles/footerStyles";

import "./style.css";

function MobileProtectedPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <CssBaseline />
      <ProtectedHeader />
      <div className="mobile-page-layout__main">
        <div
          style={{
            height: headerHeight,
          }}
        ></div>
        {children}
        <div
          style={{
            height: footerHeight,
          }}
        ></div>
      </div>
      <MobileProtectedFooter />
    </div>
  );
}

export default MobileProtectedPageLayout;
