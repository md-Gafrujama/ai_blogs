'use client'

import SubsTableItem from '@/Components/AdminComponents/SubsTableItem'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
const baseURL = process.local.env.NEXT_PUBLIC_BASE_URL;

const Page = () => {
  const [emails, setEmails] = useState([])

  const fetchEmails = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/email`)
      setEmails(response.data.emails)
    } catch (error) {
      toast.error('Failed to load subscriptions')
    }
  }

  const deleteEmail = async (mongoId) => {
    try {
      const response = await axios.delete('/api/email', {
        params: {
          id: mongoId,
        },
      })
      if (response.data.success) {
        toast.success(response.data.msg)
        fetchEmails()
      } else {
        toast.error('Error deleting email')
      }
    } catch (error) {
      toast.error('Server error')
    }
  }

  useEffect(() => {
    fetchEmails()
  }, [])

  return (
    <div className="flex-1 px-4 sm:px-10 pt-6 sm:pt-12 bg-blue-50/40 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Subscriber List</h1>

      <div className="relative max-w-3xl overflow-x-auto bg-white border border-gray-200 shadow rounded-xl scrollbar-hide">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs uppercase bg-gray-100 text-gray-500 rounded-t-xl">
            <tr>
              <th scope="col" className="px-5 py-4">Email</th>
              <th scope="col" className="px-5 py-4 hidden sm:table-cell">Date Subscribed</th>
              <th scope="col" className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {emails.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center text-gray-400 py-10">
                  No subscriptions found
                </td>
              </tr>
            ) : (
              emails.map((item, index) => (
                <SubsTableItem
                  key={item._id}
                  mongoId={item._id}
                  deleteEmail={deleteEmail}
                  email={item.email}
                  date={item.date}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Page

