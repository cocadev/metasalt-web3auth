import axios from 'axios';

const NewBackendUrl = 'http://ec2-52-23-198-19.compute-1.amazonaws.com:5000/';  // http://localhost:5000/
const NotificationBaseUrl = 'https://us-central1-metasaltnotifications.cloudfunctions.net/notification/';
const SMSBaseUrl = 'https://us-central1-metasaltnotifications.cloudfunctions.net/sms/';
const LiveStreamUrl = 'https://us-central1-metasaltnotifications.cloudfunctions.net/livestream/';
const RoomsUrl = 'https://api.100ms.live/v2/rooms';
const ActiveRoomsUrl = 'https://api.100ms.live/v2/active-rooms';
const SessionUrl = 'https://api.100ms.live/v2/sessions';


export const getAdminNotifications = async () => {
  try {
    const { data } = await axios.post(`${NotificationBaseUrl}getAdminNotifications`)
    return data
  } catch (e) {
    console.log('getAdminNotifications =====>', e)
  }
}

export const updateAdminNotification = async (body) => {
  try {
    const { data } = await axios.post(`${NotificationBaseUrl}saveAdminNotification`, body)
    return data
  } catch (e) {
    console.log('updateAdminNotification =====>', e)
  }
}


export const loginToBackend = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}login`, body)
    return data
  } catch (e) {
    console.log('loginToBackend =====>', e)
  }
}

export const getUserByAccount = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}user/get-by-account`, { params })
    return data.data
  } catch (e) {
    console.log('getUserByAccount =====>', JSON.stringify(e))
    return null
  }
}

export const getAllUsers = async () => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}user/get-all`)
    return data.data
  } catch (e) {
    console.log('getAllUsers =====>', JSON.stringify(e))
    return null
  }
}

export const updateUser = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}user/update`, body)
    return data
  } catch (e) {
    console.log('updateUser =====>', e)
  }
}

export const getAllLiveStreams = async () => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}livestream/get-all`)
    return data
  } catch (e) {
    console.log('getAllLiveStreams =====>', e)
  }
}

export const getUserLiveStreams = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}livestream/get-by-user`, { params })
    return data
  } catch (e) {
    console.log('getUserLiveStreams =====>', e)
  }
}

export const createLiveStream = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}livestream/create`, body)
    return data
  } catch (e) {
    console.log('createLiveStream =====>', e)
  }
}

export const updateLiveStream = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}livestream/update`, body)
    return data
  } catch (e) {
    console.log('updateLiveStream =====>', e)
  }
}

export const deleteLiveStream = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}livestream/delete-by-id`, body)
    return data
  } catch (e) {
    console.log('deleteLiveStream =====>', e)
  }
}

export const getAllLikes = async () => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}allLike/get-all`)
    return data.data
  } catch (e) {
    console.log('getAllLikes =====>', JSON.stringify(e))
    return null
  }
}

export const getAllLikesByUserId = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}allLike/get-by-userId`, { params })
    return data.data
  } catch (e) {
    console.log('getAllLikesByUserId =====>', JSON.stringify(e))
    return null
  }
}

export const getAllBrands = async () => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}brand/get-all`)
    return data.data
  } catch (e) {
    console.log('getAllBrands =====>', JSON.stringify(e))
    return null
  }
}

export const getBrandById = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}brand/get-by-id`, { params })
    return data.data
  } catch (e) {
    console.log('getBrandById =====>', JSON.stringify(e))
    return null
  }
}

export const getBrandsByCreator = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}brand/get-by-creator`, { params })
    return data.data
  } catch (e) {
    console.log('getBrandsByCreator =====>', JSON.stringify(e))
    return null
  }
}

export const createBrand = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}brand/create`, body)
    return data
  } catch (e) {
    console.log('createBrand =====>', e)
  }
}

export const getAllCollections = async () => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}collection/get-all`)
    return data.data
  } catch (e) {
    console.log('getAllCollections =====>', JSON.stringify(e))
    return null
  }
}

export const getCollectionById = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}collection/get-by-creator`, { params })
    return data.data
  } catch (e) {
    console.log('getCollectionsByCreator =====>', JSON.stringify(e))
    return null
  }
}

export const getCollectionsByCreator = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}collection/get-by-creator`, { params })
    return data.data
  } catch (e) {
    console.log('getCollectionsByCreator =====>', JSON.stringify(e))
    return null
  }
}

export const getCollectionByCreatorAndBrand = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}collection/get-By-creator-brand`, { params })
    return data.data
  } catch (e) {
    console.log('getCollectionByCreatorAndBrand =====>', JSON.stringify(e))
    return null
  }
}

export const createCollection = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}collection/create`, body)
    return data
  } catch (e) {
    console.log('createCollection =====>', JSON.stringify(e))
    return null
  }
}

export const updateCollectionById = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}collection/update`, body)
    return data
  } catch (e) {
    console.log('updateCollectionById =====>', JSON.stringify(e))
    return null
  }
}

export const createDiscourseServer = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}discourseServer/create`, body)
    return data
  } catch (e) {
    console.log('createDiscourseServer =====>', JSON.stringify(e))
    return null
  }
}

export const getAllLazyMints = async () => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}lazyMint/get-all`)
    return data
  } catch (e) {
    console.log('getAllLazyMints =====>', JSON.stringify(e))
    return null
  }
}

export const getLazyMintByTokenId = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}lazyMint/get-by-tokenId-one`, { params })
    return data.data
  } catch (e) {
    console.log('getLazyMintByTokenId =====>', JSON.stringify(e))
    return null
  }
}

export const getLazyMintsByTokenId = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}lazyMint/get-by-tokenId-all`, { params })
    return data.data
  } catch (e) {
    console.log('getLazyMintsByTokenId =====>', JSON.stringify(e))
    return null
  }
}

export const createLazyMint = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}lazyMint/create`, body)
    return data
  } catch (e) {
    console.log('createLazyMint =====>', JSON.stringify(e))
    return null
  }
}

export const updateLazyMintById = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}lazyMint/update`, body)
    return data
  } catch (e) {
    console.log('updateLazyMintById =====>', JSON.stringify(e))
    return null
  }
}

export const getLazyMintTransfersByTokenId = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}lazyMintTransfer/get-by-tokenId`, { params })
    return data.data
  } catch (e) {
    console.log('getLazyMintTransfersByTokenId =====>', JSON.stringify(e))
    return null
  }
}

export const getAllVideos = async () => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}video/get-all`)
    return data
  } catch (e) {
    console.log('getAllVideos =====>', e)
  }
}

export const getVideosByOwner = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}video/get-by-owner`, { params })
    return data.data
  } catch (e) {
    console.log('getVideosByOwner =====>', JSON.stringify(e))
    return null
  }
}

export const createVideo = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}video/create`, body)
    return data
  } catch (e) {
    console.log('createVideo =====>', e)
  }
}

export const getMintSupplyErc1155ByTokenId = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}mintSupplyErc1155/get-by-tokenId`, { params })
    return data.data
  } catch (e) {
    console.log('getMintSupplyErc1155ByTokenId =====>', JSON.stringify(e))
    return null
  }
}

export const createMintSupplyErc1155 = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}video/create`, body)
    return data
  } catch (e) {
    console.log('createMintSupplyErc1155 =====>', JSON.stringify(e))
    return null
  }
}

export const getAllMusicChannels = async () => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}musicChannel/get-all`)
    return data.data
  } catch (e) {
    console.log('getAllMusicChannels =====>', JSON.stringify(e))
    return null
  }
}

export const getMusicChannelById = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}musicChannel/get-by-id`, { params })
    return data.data
  } catch (e) {
    console.log('getMusicChannelById =====>', JSON.stringify(e))
    return null
  }
}

export const getMusicChannelsByCreatorId = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}music/musicChannel/get-by-creatorId`, { params })
    return data.data
  } catch (e) {
    console.log('getMusicChannelsByCreatorId =====>', JSON.stringify(e))
    return null
  }
}

export const createMusicChannel = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}musicChannel/create`, body)
    return data
  } catch (e) {
    console.log('createMusicChannel =====>', JSON.stringify(e))
    return null
  }
}

export const getMusicsByChannelId = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}music/get-by-channelId`, { params })
    return data.data
  } catch (e) {
    console.log('getMusicsByChannelId =====>', JSON.stringify(e))
    return null
  }
}

export const createMusic = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}music/create`, body)
    return data
  } catch (e) {
    console.log('createMusicChannel =====>', JSON.stringify(e))
    return null
  }
}

export const getHideNFTByTokenIdAndTokenAddress = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}hideNFT/get-by-tokenId-tokenAddress`, { params })
    return data.data
  } catch (e) {
    console.log('getHideNFTByTokenIdAndTokenAddress =====>', JSON.stringify(e))
    return null
  }
}

export const getAllOrderData = async () => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}orderData/get-all`)
    return data.data
  } catch (e) {
    console.log('getAllOrderData =====>', JSON.stringify(e))
    return null
  }
}

export const getOrderDataByTokenId = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}orderData/get-by-tokenId`, { params })
    return data.data
  } catch (e) {
    console.log('getOrderDataByTokenId =====>', JSON.stringify(e))
    return null
  }
}

export const createOrderData = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}orderData/create`, body)
    return data
  } catch (e) {
    console.log('createOrderData =====>', JSON.stringify(e))
    return null
  }
}

export const updateOrderDataById = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}orderData/update`, body)
    return data
  } catch (e) {
    console.log('createOrderData =====>', JSON.stringify(e))
    return null
  }
}

export const deleteOrderDataById = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}orderData/delete`, body)
    return data
  } catch (e) {
    console.log('deleteOrderDataById =====>', e)
  }
}

export const createRealTimeHistory = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}realTimeHistory/create`, body)
    return data
  } catch (e) {
    console.log('createRealTimeHistory =====>', e)
  }
}

export const getRequestOrdersByTokenId = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}requestOrder/get-by-tokenId`, { params })
    return data.data
  } catch (e) {
    console.log('getRequestOrdersByTokenId =====>', e)
    return null
  }
}

export const createRequestOrder = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}requestOrder/create`, body)
    return data
  } catch (e) {
    console.log('createRequestOrder =====>', e)
  }
}

export const updateRequestOrder = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}requestOrder/update`, body)
    return data
  } catch (e) {
    console.log('updateRequestOrder =====>', JSON.stringify(e))
    return null
  }
}

export const getRewardsByOwner = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}reward/get-by-owner`, { params })
    return data.data
  } catch (e) {
    console.log('getRewardsByOwner =====>', JSON.stringify(e))
    return null
  }
}

export const getAllVerifications = async () => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}verification/get-all`)
    return data.data
  } catch (e) {
    console.log('getAllVerifications =====>', JSON.stringify(e))
    return null
  }
}

export const getVerificationByVerifierAndTokenURI = async (params) => {
  try {
    const { data } = await axios.get(`${NewBackendUrl}verification/get-by-verifier-tokenURI`, { params })
    return data.data
  } catch (e) {
    console.log('getVerificationByVerifierAndTokenURI =====>', JSON.stringify(e))
    return null
  }
}

export const createVerification = async (body) => {
  try {
    const { data } = await axios.post(`${NewBackendUrl}verification/create`, body)
    return data
  } catch (e) {
    console.log('createVerification =====>', JSON.stringify(e))
    return null
  }
}


export const saveUser = async (data) => {
  try {
    await axios.post(`${NotificationBaseUrl}saveUser`, data)
  } catch (e) {
    console.log('saveUser =====>', e)
  }
}


export const getUnReadBadgeCount = async (data) => {
  try {
    const response = await axios.post(`${NotificationBaseUrl}getUnReadBadgeCount`, data)
    return response.data.data
  } catch (e) {
    console.log('getUnReadBadgeCount =====>', e)
    return 0
  }
}

export const getUserNotifications = async (data) => {
  try {
    const response = await axios.post(`${NotificationBaseUrl}getUserNotifications`, data)
    return response.data.data
  } catch (e) {
    console.log('getUserNotifications =====>', e)
    return []
  }
}

export const bulkMarkAsReadUserNotifications = async (data) => {
  try {
    await axios.post(`${NotificationBaseUrl}bulkMarkAsReadUserNotifications`, data)
  } catch (e) {
    console.log('bulkMarkAsReadUserNotifications =====>', e)
  }
}

export const sendNotification = async (data) => {
  try {
    await axios.post(`${NotificationBaseUrl}sendNotification`, data)
  } catch (e) {
    console.log('sendNotification =====>', e)
  }
}

export const sendNotificationToAll = async (data) => {
  try {
    await axios.post(`${NotificationBaseUrl}sendNotificationToAll`, data)
  } catch (e) {
    console.log('sendNotificationToAll =====>', e)
  }
}

export const sendNotificationToInvite = async (data) => {
  try {
    await axios.post(`${NotificationBaseUrl}inviteFriend`, data)
  } catch (e) {
    console.log('sendNotificationToInvite =====>', e)
  }
}

export const updateUserService = async (data) => {
  try {
    await axios.post(`${SMSBaseUrl}updateUserService`, data)
  } catch (e) {
    console.log('updateUserService =====>', e)
  }
}

export const getUserSMSEnabledStatus = async (data) => {
  try {
    const response = await axios.post(`${SMSBaseUrl}getUserSMSEnabledStatus`, data)
    return response.data
  } catch (e) {
    console.log('getUserSMSEnabledStatus =====>', e)
  }
}

export const updateUserSMSEnabledStatus = async (data) => {
  try {
    await axios.post(`${SMSBaseUrl}updateUserSMSEnabledStatus`, data)
  } catch (e) {
    console.log('updateUserSMSEnabledStatus =====>', e)
  }
}

export const smsVerification = async (data) => {
  try {
    const response = await axios.post(`${SMSBaseUrl}smsVerification`, data)
    return response.data
  } catch (e) {
    console.log('smsVerification e ====>', e)
  }
}

export const smsVerificationCheck = async (data) => {
  try {
    const response = await axios.post(`${SMSBaseUrl}smsVerificationCheck`, data)
    return response.data
  } catch (e) {
    console.log('smsVerificationCheck e ====>', e)
  }
}


export const getManagementToken = async () => {
  try {
    const response = await axios.post(`${LiveStreamUrl}managementToken`)
    return response.data.data
  } catch (e) {
    console.log('getManagementToken e ====>', e)
    return ''
  }
}

export const generateAppToken = async (roomId, userId, role) => {
  try {
    const response = await axios.post(
      `${LiveStreamUrl}generateAppToken`,
      { roomId, userId, role }
    )
    return response.data.data
  } catch (e) {
    console.log('generateAppToken e ====>', e)
  }
}

export const createRoom = async (managementToken, data) => {
  try {
    const response = await axios.post(
      RoomsUrl,
      data,
      {
        headers: {
          Authorization: `Bearer ${managementToken}`,
          'Content-Type': 'application/json',
        }
      }
    )
    return response.data
  } catch (e) {
    console.log('createRoom e ====>', e)
    return null
  }
}

export const getActiveSessions = async (managementToken) => {
  try {
    const response = await axios.get(
      `${SessionUrl}?active=true`,
      {
        headers: { Authorization: `Bearer ${managementToken}` }
      }
    )
    return response.data.data
  } catch (e) {
    console.log('getActiveSessions e ====>', e)
  }
}

export const getRooms = async (managementToken) => {
  try {
    const response = await axios.get(
      `${RoomsUrl}?enabled=true`,
      {
        headers: { Authorization: `Bearer ${managementToken}` }
      }
    )
    return response.data.data
  } catch (e) {
    console.log('getRooms e ====>', e)
    return []
  }
}

export const getRoom = async (managementToken, roomId) => {
  try {
    const response = await axios.get(
      `${RoomsUrl}/${roomId}`,
      {
        headers: { Authorization: `Bearer ${managementToken}` }
      }
    )
    return response.data
  } catch (e) {
    console.log('getRoom e ====>', e)
  }
}

export const getActiveRoom = async (managementToken, roomId) => {
  try {
    const response = await axios.post(`${LiveStreamUrl}getActiveRoom`, { managementToken, roomId })
    return response.data.data
  } catch (e) {
    console.log('getActiveRoom e ====>', e)
  }
}

export const endActiveRoom = async (managementToken, roomId) => {
  try {
    await axios.post(`${LiveStreamUrl}endActiveRoom`, { managementToken, roomId })
  } catch (e) {
    console.log('endActiveRoom e ====>', e)
  }
}

export const manageRoom = async (managementToken, roomId, status) => {
  try {
    const response = await axios.post(
      `${RoomsUrl}/${roomId}`,
      { enabled: status },
      {
        headers: {
          Authorization: `Bearer ${managementToken}`,
          'Content-Type': 'application/json',
        }
      }
    )
    return response.data
  } catch (e) {
    console.log('manageRoom e ====>', e)
  }
}

export const getSession = async (managementToken, sessionId) => {
  try {
    const response = await axios.get(
      `${SessionUrl}/${sessionId}`,
      {
        headers: { Authorization: `Bearer ${managementToken}` }
      }
    )
    return response.data
  } catch (e) {
    console.log('getSession e ====>', e)
  }
}

export const getPeer = async (managementToken, roomId, peerId) => {
  try {
    const response = await axios.post(
      `${LiveStreamUrl}getPeer`,
      { managementToken, roomId, peerId }
    )
    return response.data.data
  } catch (e) {
    console.log('getPeer e ====>', e)
  }
}

export const removePeers = async (managementToken, roomId, data) => {
  try {
    const response = await axios.post(
      `${ActiveRoomsUrl}/${roomId}/remove-peers`,
      data,
      {
        headers: {
          Authorization: `Bearer ${managementToken}`,
          'Content-Type': 'application/json',
        }
      }
    )
    return response.data
  } catch (e) {
    console.log('removePeers e ====>', e)
  }
}

export const sendMessage = async (managementToken, roomId, data) => {
  try {
    const response = await axios.post(
      `${ActiveRoomsUrl}/${roomId}/send-message`,
      data,
      {
        headers: {
          Authorization: `Bearer ${managementToken}`,
          'Content-Type': 'application/json',
        }
      }
    )
    return response.data
  } catch (e) {
    console.log('sendMessage e ====>', e)
  }
}


export const registerNew = async (data) => {
  try {
    await axios.post(`${NewBackendUrl}register`, data)
  } catch (e) {
    console.log('registerNew =====>', e)
  }
}
