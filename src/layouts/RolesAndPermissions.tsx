'use client'

import React, { useState } from "react"
import ClientCreationForm from "./ClientCreationForm"

const RolesAndPermissions: React.FC = () => {
  const [showEndpointsModal, setShowEndpointsModal] = useState(false)

  const handleViewPermissions = () => {
    setShowEndpointsModal(true)
  }

  const closeModal = () => {
    setShowEndpointsModal(false)
  }

  return (
    <div className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Role and Permission Management
        </h1>
      </div>
      <ClientCreationForm />
    </div>
  )
}

export default RolesAndPermissions

