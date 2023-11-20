import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
    return (
        <>
            <UserHeader />
            <UserPost likes={1200} replies={320} postImg="/post11.png" postTitle="This is my first post" />
            <UserPost likes={1200} replies={320} postImg="/post2.png" postTitle="Hello fiends" />
            <UserPost likes={1100} replies={3320} postImg="/post3.png" postTitle="Zuong day" />
            <UserPost likes={16700} replies={2345} postImg="/post1.png" postTitle="T1 mai dinh" />
        </>
    );
};

export default UserPage;
