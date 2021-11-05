import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

import { appBarSx, headerTextButtonSx } from "../sharedStyles/headerStyles";

function AuthHeader() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={appBarSx}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Roomie
          </Typography>
          <Button
            color="inherit"
            component={Link}
            sx={headerTextButtonSx}
            to="/"
          >
            Login
          </Button>
          <Button
            color="inherit"
            component={Link}
            sx={headerTextButtonSx}
            to="/register"
          >
            Register
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default AuthHeader;
