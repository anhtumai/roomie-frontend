import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";

import SharedHeaderComponents from "../SharedHeaderComponents";

import { appBarSx } from "components/sharedStyles/headerStyles";

function MobileProtectedHeader() {
  return (
    <AppBar position="fixed" sx={appBarSx}>
      <Toolbar>
        <SharedHeaderComponents />
      </Toolbar>
    </AppBar>
  );
}

export default MobileProtectedHeader;
