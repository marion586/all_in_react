import styles from "./styles.module.css";
import MessagesReceived from "./message";
import SendMessage from "./send-message";

const Chat = ({ socket, username, room }: any) => {
  return (
    <div className={styles.chatContainer}>
      <div>
        <MessagesReceived socket={socket} />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
    </div>
  );
};

export default Chat;
