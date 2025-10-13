"use client";
import React from "react";
// import ChartThree from "../Charts/ChartThree";
import ChartTwo from "../Charts/ChartTwo";
// import ChatCard from "../Chat/ChatCard";
// import TableOne from "../Tables/TableOne";
// import MapOne from "../Maps/MapOne";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import ChartOne from "@/components/Charts/ChartOne";
import { Mail, CheckCircle, Clock, XCircle } from 'lucide-react';

const stats = {
  totalInvited: 24,
  activeUsers: 18,
  pending: 6,
  declined: 2
};

const recentActivity = [
  { user: 'john@example.com', action: 'Accepted invite', time: '2 hours ago', status: 'success' },
  { user: 'sarah@example.com', action: 'Invite sent', time: '5 hours ago', status: 'pending' },
  { user: 'mike@example.com', action: 'Joined pilot', time: '1 day ago', status: 'success' }
];

const Dashboard: React.FC = () => {

  return (
    <>
      {/* <DataStatsOne />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div> */}


      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Total Invited</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stats.totalInvited}</p>
              </div>
              <Mail className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Active Users</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stats.activeUsers}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Pending</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stats.pending}</p>
              </div>
              <Clock className="text-yellow-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm">Declined</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stats.declined}</p>
              </div>
              <XCircle className="text-red-500" size={32} />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <div>
                      <p className="font-medium text-slate-800">{activity.user}</p>
                      <p className="text-sm text-slate-600">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-sm text-slate-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default Dashboard;
