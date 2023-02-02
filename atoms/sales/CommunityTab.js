import React, { memo} from 'react';
import clsx from 'clsx';

const CommunityTab = ({filteredGates, isActive, setIsActive, allLikesData}) => {

  const totalCounts = filteredGates.length;
  const favData = filteredGates.filter(item => allLikesData.includes(item.id)) 
  const totalCountsOfFav = favData.length;

  return (
    <div className='profile-header'>
      <div className={clsx('profile-header-btn', isActive === 1 && 'pbtn-active')} onClick={() => setIsActive(1)}><i className="wm icon_wallet"></i> &nbsp;&nbsp;&nbsp;All&nbsp;&nbsp;&nbsp;{totalCounts}</div>
      <div className={clsx('profile-header-btn', isActive === 2 && 'pbtn-active')} onClick={() => setIsActive(2)}><i className="wm icon_heart_alt"></i>&nbsp;&nbsp;&nbsp;Favorited&nbsp;&nbsp;&nbsp;{totalCountsOfFav}</div>
    </div>
  );
}

export default memo(CommunityTab);