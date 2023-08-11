import styles from "./styles.module.css";
import { useState, useEffect } from "react";

const Messages = ({ socket }: any) => {
  const [messagesReceived, setMessagesReceived] = useState<any>([]);
  useEffect(() => {
    socket.on("receive_message", (data: any) => {
      console.log(data);
      setMessagesReceived((state: any) => [
        ...state,
        {
          message: data.message,
          username: data.username,
          __createdtime__: data.__createdtime__,
        },
      ]);
    });

    return () => socket.off("receive_message");
  }, [socket]);

  function formatDateFromTimestamp(timestamp: any) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return (
    <div className={styles.messagesColumn}>
      {messagesReceived.map((msg: any, i: any) => (
        <div className={styles.message} key={i}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span className={styles.msgMeta}>{msg.username}</span>
            <span className={styles.msgMeta}>
              {formatDateFromTimestamp(msg.__createdtime__)}
            </span>
          </div>
          <p className={styles.msgText}>{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Messages;
