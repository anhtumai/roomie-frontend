import { Box, CssBaseline } from "@mui/material";

import ProtectedHeader from "components/ProtectedHeader/MobileVersion";

import { headerHeight } from "components/sharedStyles/headerStyles";

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
      </div>
    </div>
  );
}

export default MobileProtectedPageLayout;
