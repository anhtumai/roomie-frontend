import { useState, ReactNode } from "react";
import { Box, CssBaseline } from "@mui/material";

import ProtectedHeader from "components/ProtectedHeader";
import NavigationBar from "components/NavigationBar";
import { headerHeight } from "components/sharedStyles/headerStyles";
import { mainBoxSx } from "./style";

function ProtectedPageLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ProtectedHeader open={open} setOpen={setOpen} />
      <NavigationBar open={open} setOpen={setOpen} />
      <Box component="main" sx={mainBoxSx}>
        <div
          style={{
            height: headerHeight,
          }}
        ></div>
        {children}
      </Box>
    </Box>
  );
}

export default ProtectedPageLayout;
