import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ChakraProvider, extendTheme, ColorModeScript } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const styles = {
    global: (props) => ({
        body: {
            color: mode("gray.900", "whiteAlpha.900")(props),
            bg: mode("gray.100", "#101010")(props),
        },
    }),
};

const config = {
    inititalColorMode: "dark",
    useSystemColorMode: true,
};

const colors = {
    gray: {
        ligth: "#616161",
        dark: "#1e1e1e1",
    },
};

const theme = extendTheme({ config, styles, colors });

const rootElement = document.getElementById("root");
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <ColorModeScript inititalColorMode={theme.config.inititalColorMode} />
            <App />
        </ChakraProvider>
    </React.StrictMode>,
);
