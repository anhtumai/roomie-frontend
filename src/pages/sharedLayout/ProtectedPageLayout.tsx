import { useState, ReactNode } from "react";
import { Box, CssBaseline } from "@mui/material";

import ProtectedHeader from "components/ProtectedHeader";
import NavigationBar from "components/NavigationBar";

function HeaderGap() {
  const headerHeight = "4.5rem";
  return (
    <div
      style={{
        minHeight: headerHeight,
        margin: 0,
        padding: 0,
      }}
    ></div>
  );
}

function ProtectedPageLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ProtectedHeader open={open} setOpen={setOpen} />
      <NavigationBar open={open} setOpen={setOpen} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <HeaderGap />
        {children}
      </Box>
    </Box>
  );
}

export default ProtectedPageLayout;
