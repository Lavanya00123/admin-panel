import React, { useEffect, useState } from "react";
import axios from "axios"; // Or you can use fetch
import { BASE_URL } from './constants'

import MessagesCard from "./MessagesData";
import CallLogTable from "./CallLogTable";

const Dashboard = ({ employeeId }) => {
  const [messagesData, setMessagesData] = useState([]);
  const [callLogs, setCallLogs] = useState([]);

  // Fetch messages and call logs when the component mounts
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/messages`);
        setMessagesData(response.data); // Store the messages in state
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="absolute top-16 md:left-[270px] xs:left-0 xs:right-0 right-0">
      {/* Pass the data to the components */}
      <MessagesCard messages={messagesData} />
    </div>
  );
};

export default Dashboard;
