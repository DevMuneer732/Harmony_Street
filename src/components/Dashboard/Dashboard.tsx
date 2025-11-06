"use client";
import React from "react";
import ChartThree from "../Charts/ChartThree";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import MapOne from "../Maps/MapOne";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import ChartOne from "@/components/Charts/ChartOne";
import RecentActivity from "./RecentActivity";

const recentActivity = [
  { user: 'john@example.com', action: 'Accepted invite', time: '2 hours ago', status: 'success' },
  { user: 'sarah@example.com', action: 'Invite sent', time: '5 hours ago', status: 'pending' },
  { user: 'mike@example.com', action: 'Joined pilot', time: '1 day ago', status: 'success' }
];

const Dashboard: React.FC = () => {

  return (
    <>

      <div className="space-y-6">
        <DataStatsOne />
        {/* <ChartOne /> */}
       

        {/* Recent Activity */}
       <div className="md:col-span-2 lg:col-span-2">
        <RecentActivity />
      </div>
      </div>


    </>
  );
};

export default Dashboard;
