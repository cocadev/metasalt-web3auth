import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutPage from '../../components/layouts/layoutPage';
import LayoutScreen from '../../components/layouts/layoutScreen';
import { getAdminNotifications, updateAdminNotification } from '../../common/api';
import { DropdownStyles } from '../../constants/dropdownlist';


const AdminMessage = () => {

  const dispatch = useDispatch()
  const [notifications, setNotifications] = useState([]);
  const [type, setType] = useState('');
  const [body, setBody] = useState('');

  const loadNotifications = async () => {
    const response = await getAdminNotifications()
    const notificationList = response.data.map((item, index) => {
      return {
        id: index + 1,
        label: item.type,
        value: item.type,
        type: item.type,
        body: item.body,
      }
    })
    setNotifications(notificationList)
  }

  const selectType = (event) => {
    setType(event.value);
  };

  const saveNotification = async () => {
    if (type !== '') {
      const response = await updateAdminNotification({ type, body })
      if (response.success) {
        const notificationList = response.data.map((item, index) => {
          return {
            id: index + 1,
            label: item.type,
            value: item.type,
            type: item.type,
            body: item.body,
          }
        })
        setNotifications(notificationList)
        dispatch(addNotification(response.message, 'success'))
      }
    } else {
      dispatch(addNotification('Notification type is not selected!', 'error'))
    }
  }

  useEffect(() => {
    if (type !== '') {
      const notificationItem = notifications.filter(item => item.type === type);
      setBody(notificationItem[0].body);
    }
  }, [type])

  useEffect(() => {
    loadNotifications().then();
  }, [])

  return (
    <LayoutPage>
      <LayoutScreen title='Message'>
        <div className='mt-5 color-b'>
          <div className='main-view'>
            <div className='w-100'>
              <Select
                styles={DropdownStyles}
                menuContainerStyle={{ 'zIndex': 999 }}
                options={notifications}
                onChange={selectType}
              />
            </div>
            <div className='w-100 my-3'>
              <textarea
                className='w-full br-4 form-control'
                style={{ border: '1px solid #ccc' }}
                rows="5"
                placeholder='Notification Body'
                value={body}
                onChange={e => setBody(e.target.value)}
              />
            </div>
            <div className='my-3 text-center'>
              <div className="max-width-100 offer-btn buy-btn" onClick={saveNotification}>Save</div>
            </div>
          </div>
        </div>
      </LayoutScreen>
    </LayoutPage>
  );
}

export default AdminMessage;