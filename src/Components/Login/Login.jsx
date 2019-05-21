import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  CardHeader,
  TextField,
  Button
} from "@material-ui/core";
import {Link } from "react-router-dom";

class Login extends Component {
  render() {
    return (
      <div>
        <div
          style={{
            display: "flex",
            flex: "1 0 auto",
            textAlign: "center",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: "150px",
            paddingBottom: "250px",
            background: "#1e242c"
          }}
        >
          <div
            align="center"
            style={{ width: "400px", flexDirection: "column", flexShrink: 0 }}
          >
            <Card style={{paddingBottom:"5px"}}>
              <CardHeader title="Login"/>
              <CardContent>
              <TextField
                    name="username"
                    className="roundInput"
                    disableUnderline={true}
                    id="outlined-name"
                    placeholder="UserName"
                    margin="normal"
                    variant="outlined"
                />
                  <TextField
                   name="password"
                   className="roundInput"
                   disableUnderline={true}
                   id="outlined-name"
                   placeholder="Password"
                   margin="normal"
                   variant="outlined"
                /> 
              </CardContent>
              <Button 
                component={Link}
                to="/table"
                variant="contained" 
                color="primary"
                style={{ width: "auto" }}>
                    Login
               </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}


export default Login;