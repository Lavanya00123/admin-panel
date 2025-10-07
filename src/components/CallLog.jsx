import React, { useState, useEffect } from "react";
import CallLogTable from "./CallLogTable";
import { BASE_URL } from './constants'

const CallLog = () => {
  const [callLogs, setCallLogs] = useState([]);

  return (
    <div className="absolute top-20 right-10 left-[270px]">
      <h2 className="text-2xl font-bold mb-4">Call Log</h2>

      <CallLogTable />
    </div>
  );
};

export default CallLog;
