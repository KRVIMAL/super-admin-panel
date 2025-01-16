'use client'

import { useState } from 'react'
import { format } from 'date-fns'

type Resource = 'users' | 'products'
type Permission = 'read' | 'delete' | 'update'

interface ResponseCode {
  code: number
  description: string
}

interface Endpoint {
  allowed: boolean
  name: string
  payload: Record<string, string>
  responseCodes: ResponseCode[]
}

interface PermissionData {
  limit: number
  allowed: boolean
  allowedEndpoints: Endpoint[]
}

interface UserData {
  name: string
  email: string
  password: string
  apiKey: string
  apiKeyExpiresAt: string
  roles: string[]
  permissionMatrix: any
}

export default function ClientCreationForm() {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    password: '',
    apiKey: '',
    apiKeyExpiresAt: '',
    roles: [],
    permissionMatrix: {},
  })

  const [selectedResources, setSelectedResources] = useState<Resource[]>([])
  const [expandedPermissions, setExpandedPermissions] = useState<string[]>([])
  const [showDatePicker, setShowDatePicker] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const generateApiKey = () => {
    const apiKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setUserData({ ...userData, apiKey })
  }

  const handleDateSelect = (date: string) => {
    setUserData({ ...userData, apiKeyExpiresAt: new Date(date).toISOString() })
    setShowDatePicker(false)
  }

  const handleResourceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const resource = e.target.value as Resource
    if (!selectedResources.includes(resource)) {
      setSelectedResources([...selectedResources, resource])
      setUserData({
        ...userData,
        permissionMatrix: {
          ...userData.permissionMatrix,
          [resource]: {},
        },
      })
    }
  }

  const togglePermission = (permissionId: string) => {
    setExpandedPermissions(prev => 
      prev.includes(permissionId) 
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handlePermissionChange = (resource: Resource, permission: Permission, field: keyof PermissionData, value: any) => {
    setUserData({
      ...userData,
      permissionMatrix: {
        ...userData.permissionMatrix,
        [resource]: {
          ...userData.permissionMatrix[resource],
          [permission]: {
            ...userData.permissionMatrix[resource]?.[permission],
            [field]: value,
          },
        },
      },
    })
  }

  const handleEndpointChange = (resource: Resource, permission: Permission, index: number, field: keyof Endpoint, value: any) => {
    const updatedEndpoints = [...(userData.permissionMatrix[resource]?.[permission]?.allowedEndpoints || [])]
    updatedEndpoints[index] = { ...updatedEndpoints[index], [field]: value }
    handlePermissionChange(resource, permission, 'allowedEndpoints', updatedEndpoints)
  }

  const addEndpoint = (resource: Resource, permission: Permission) => {
    const newEndpoint: Endpoint = {
      allowed: true,
      name: '',
      payload: {},
      responseCodes: [],
    }

    handlePermissionChange(
      resource,
      permission,
      'allowedEndpoints',
      [...(userData.permissionMatrix[resource]?.[permission]?.allowedEndpoints || []), newEndpoint]
    )
  }

  const removeEndpoint = (resource: Resource, permission: Permission, index: number) => {
    const updatedEndpoints = [...(userData.permissionMatrix[resource]?.[permission]?.allowedEndpoints || [])]
    updatedEndpoints.splice(index, 1)
    handlePermissionChange(resource, permission, 'allowedEndpoints', updatedEndpoints)
  }

  const addPayloadField = (resource: Resource, permission: Permission, endpointIndex: number) => {
    const updatedEndpoints = [...(userData.permissionMatrix[resource]?.[permission]?.allowedEndpoints || [])]
    const newPayload = { ...updatedEndpoints[endpointIndex].payload, '': '' }
    updatedEndpoints[endpointIndex] = { ...updatedEndpoints[endpointIndex], payload: newPayload }
    handlePermissionChange(resource, permission, 'allowedEndpoints', updatedEndpoints)
  }

  const updatePayloadField = (resource: Resource, permission: Permission, endpointIndex: number, oldKey: string, newKey: string, value: string) => {
    const updatedEndpoints = [...(userData.permissionMatrix[resource]?.[permission]?.allowedEndpoints || [])]
    const newPayload = { ...updatedEndpoints[endpointIndex].payload }
    delete newPayload[oldKey]
    newPayload[newKey] = value
    updatedEndpoints[endpointIndex] = { ...updatedEndpoints[endpointIndex], payload: newPayload }
    handlePermissionChange(resource, permission, 'allowedEndpoints', updatedEndpoints)
  }

  const removePayloadField = (resource: Resource, permission: Permission, endpointIndex: number, key: string) => {
    const updatedEndpoints = [...(userData.permissionMatrix[resource]?.[permission]?.allowedEndpoints || [])]
    const newPayload = { ...updatedEndpoints[endpointIndex].payload }
    delete newPayload[key]
    updatedEndpoints[endpointIndex] = { ...updatedEndpoints[endpointIndex], payload: newPayload }
    handlePermissionChange(resource, permission, 'allowedEndpoints', updatedEndpoints)
  }

  const addResponseCode = (resource: Resource, permission: Permission, endpointIndex: number) => {
    const updatedEndpoints = [...(userData.permissionMatrix[resource]?.[permission]?.allowedEndpoints || [])]
    const newResponseCode: ResponseCode = { code: 0, description: '' }
    updatedEndpoints[endpointIndex] = {
      ...updatedEndpoints[endpointIndex],
      responseCodes: [...updatedEndpoints[endpointIndex].responseCodes, newResponseCode],
    }
    handlePermissionChange(resource, permission, 'allowedEndpoints', updatedEndpoints)
  }

  const updateResponseCode = (resource: Resource, permission: Permission, endpointIndex: number, codeIndex: number, field: keyof ResponseCode, value: any) => {
    const updatedEndpoints = [...(userData.permissionMatrix[resource]?.[permission]?.allowedEndpoints || [])]
    updatedEndpoints[endpointIndex] = {
      ...updatedEndpoints[endpointIndex],
      responseCodes: updatedEndpoints[endpointIndex].responseCodes.map((code:any, index:any) =>
        index === codeIndex ? { ...code, [field]: value } : code
      ),
    }
    handlePermissionChange(resource, permission, 'allowedEndpoints', updatedEndpoints)
  }

  const removeResponseCode = (resource: Resource, permission: Permission, endpointIndex: number, codeIndex: number) => {
    const updatedEndpoints = [...(userData.permissionMatrix[resource]?.[permission]?.allowedEndpoints || [])]
    updatedEndpoints[endpointIndex] = {
      ...updatedEndpoints[endpointIndex],
      responseCodes: updatedEndpoints[endpointIndex].responseCodes.filter((_:any, index:any) => index !== codeIndex),
    }
    handlePermissionChange(resource, permission, 'allowedEndpoints', updatedEndpoints)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3000/gateway/createClient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error('Failed to create client')
      }

      const result = await response.json()
      console.log('Client created:', result)
      alert('Client created successfully')
    } catch (error) {
      console.error('Error creating client:', error)
      alert('Failed to create client')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Create Client</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={userData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={userData.email}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={userData.password}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">API Key</label>
            <div className="flex gap-2">
              <input
                id="apiKey"
                name="apiKey"
                type="text"
                readOnly
                value={userData.apiKey}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-50"
              />
              <button
                type="button"
                onClick={generateApiKey}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Generate
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">API Key Expiration</label>
            <div className="relative">
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleDateSelect(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Permission Matrix</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Resources</label>
            <select
              onChange={handleResourceSelect}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a resource</option>
              <option value="users">Users</option>
              <option value="products">Products</option>
            </select>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedResources.map((resource) => (
              <span key={resource} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                {resource}
              </span>
            ))}
          </div>
          {selectedResources.map((resource) => (
            <div key={resource} className="bg-white rounded-lg border p-4">
              <h3 className="text-lg font-semibold mb-4">{resource}</h3>
              {(['read', 'delete', 'update'] as Permission[]).map((permission) => (
                <div key={permission} className="mb-4">
                  <button
                    type="button"
                    onClick={() => togglePermission(`${resource}-${permission}`)}
                    className="flex items-center justify-between w-full px-4 py-2 text-left text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md"
                  >
                    <span>{permission}</span>
                    <span>{expandedPermissions.includes(`${resource}-${permission}`) ? '−' : '+'}</span>
                  </button>
                  
                  {expandedPermissions.includes(`${resource}-${permission}`) && (
                    <div className="mt-2 pl-4 space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`${resource}-${permission}-allowed`}
                          checked={userData.permissionMatrix[resource]?.[permission]?.allowed || false}
                          onChange={(e) => handlePermissionChange(resource, permission, 'allowed', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={`${resource}-${permission}-allowed`} className="text-sm text-gray-700">
                          Allowed
                        </label>
                      </div>
                      
                      <div>
                        <label htmlFor={`${resource}-${permission}-limit`} className="block text-sm font-medium text-gray-700">
                          Limit
                        </label>
                        <input
                          type="number"
                          id={`${resource}-${permission}-limit`}
                          value={userData.permissionMatrix[resource]?.[permission]?.limit || ''}
                          onChange={(e) => handlePermissionChange(resource, permission, 'limit', parseInt(e.target.value))}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Allowed Endpoints</label>
                        {userData.permissionMatrix[resource]?.[permission]?.allowedEndpoints?.map((endpoint:any, index:any) => (
                          <div key={index} className="mt-2 border rounded-md p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Endpoint {index + 1}</span>
                              <button
                                type="button"
                                onClick={() => removeEndpoint(resource, permission, index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </div>

                            <div className="space-y-4">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`${resource}-${permission}-endpoint-${index}-allowed`}
                                  checked={endpoint.allowed}
                                  onChange={(e) => handleEndpointChange(resource, permission, index, 'allowed', e.target.checked)}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor={`${resource}-${permission}-endpoint-${index}-allowed`} className="text-sm text-gray-700">
                                  Allowed
                                </label>
                              </div>

                              <div>
                                <label htmlFor={`${resource}-${permission}-endpoint-${index}-name`} className="block text-sm font-medium text-gray-700">
                                  Name
                                </label>
                                <input
                                  type="text"
                                  id={`${resource}-${permission}-endpoint-${index}-name`}
                                  value={endpoint.name}
                                  onChange={(e) => handleEndpointChange(resource, permission, index, 'name', e.target.value)}
                                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">Payload</label>
                                {Object.entries(endpoint.payload).map(([key, value]:any, payloadIndex) => (
                                  <div key={payloadIndex} className="flex items-center space-x-2 mt-2">
                                    <input
                                      type="text"
                                      placeholder="Key"
                                      value={key}
                                      onChange={(e) => updatePayloadField(resource, permission, index, key, e.target.value, value)}
                                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Value"
                                      value={value}
                                      onChange={(e) => updatePayloadField(resource, permission, index, key, key, e.target.value)}
                                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removePayloadField(resource, permission, index, key)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addPayloadField(resource, permission, index)}
                                  className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                                >
                                  + Add Payload Field
                                </button>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700">Response Codes</label>
                                {endpoint.responseCodes.map((code:any, codeIndex:any) => (
                                  <div key={codeIndex} className="flex items-center space-x-2 mt-2">
                                    <input
                                      type="number"
                                      placeholder="Code"
                                      value={code.code}
                                      onChange={(e) => updateResponseCode(resource, permission, index, codeIndex, 'code', parseInt(e.target.value))}
                                      className="w-24 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Description"
                                      value={code.description}
                                      onChange={(e) => updateResponseCode(resource, permission, index, codeIndex, 'description', e.target.value)}
                                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeResponseCode(resource, permission, index, codeIndex)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addResponseCode(resource, permission, index)}
                                  className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                                >
                                  + Add Response Code
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addEndpoint(resource, permission)}
                          className="mt-2 text-sm text-blue-500 hover:text-blue-700"
                        >
                          + Add Endpoint
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </form>
  )
}

