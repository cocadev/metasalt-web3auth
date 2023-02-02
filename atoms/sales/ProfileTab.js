import React, { memo } from 'react';
import moment from 'moment';
import clsx from 'clsx';

const ProfileTab = ({ realData, isActive, setIsActive, likesData = [] }) => {

  const totalCounts = realData.length;
  const createdData = realData.filter((item) => moment().diff(moment(item.synced_at).add(10, 'days')) < 0)
  const totalCountsOfCreated = createdData.length;
  const favData = realData.filter(item => likesData.includes(item.token_id)) 
  const totalCountsOfFav = favData.length;

  return (
    <div className='profile-header'>
      <div className={clsx('profile-header-btn', isActive === 1 && 'pbtn-active')} onClick={() => setIsActive(1)}><i className="wm icon_wallet"></i> &nbsp;&nbsp;&nbsp;All&nbsp;&nbsp;&nbsp;{totalCounts}</div>
      <div className={clsx('profile-header-btn', isActive === 2 && 'pbtn-active')} onClick={() => setIsActive(2)}><i className="wm icon_bag_alt"></i>&nbsp;&nbsp;&nbsp;New&nbsp;&nbsp;&nbsp;{totalCountsOfCreated}</div>
      <div className={clsx('profile-header-btn', isActive === 3 && 'pbtn-active')} onClick={() => setIsActive(3)}><i className="wm icon_heart_alt"></i>&nbsp;&nbsp;&nbsp;Favorited&nbsp;&nbsp;&nbsp;{totalCountsOfFav}</div>
    </div>
  );
}

export default memo(ProfileTab);
