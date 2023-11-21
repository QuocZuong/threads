import { Container } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
function App() {
    return (
        <Container maxW="620px">
            <Header />
            <Routes>
                <Route path="/:username" element={<UserPage />}></Route>
                <Route path="/:username/post/:pid" element={<PostPage />}></Route>
            </Routes>
        </Container>
    );
}

export default App;
