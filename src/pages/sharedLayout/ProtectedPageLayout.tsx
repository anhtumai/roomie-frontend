import { useState, ReactNode } from "react";
import { Box, CssBaseline } from "@mui/material";

import ProtectedHeader from "../../components/ProtectedHeader";
import NavigationBar from "../../components/NavigationBar";
import DrawerHeader from "../../components/Common/DrawerHeader";

function ProtectedPageLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <ProtectedHeader open={open} setOpen={setOpen} />
      <NavigationBar open={open} setOpen={setOpen} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}

export default ProtectedPageLayout;
