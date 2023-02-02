import React from 'react';
import { useState } from 'react';
import { useMoralis } from 'react-moralis';
import LayoutModal from '../layouts/layoutModal';

const ModalCreateChannel = ({ onClose, onSuccess, serverId }) => {

  const { account, Moralis } = useMoralis();
  const [channelName, setChannelName] = useState();

  const onCreateChannel = async() => {
    const DiscourseChannels = Moralis.Object.extend('DiscourseChannels');
    const channels = new DiscourseChannels();
    const request = {
      owner: account,
      title: channelName,
      serverId
    }
    await channels.save(request);
    setChannelName(null);
    onSuccess();
  }

  return (
    <LayoutModal
      isOpen={true}
      onClose={onClose}
      title={'Create a channel'}
    >

      <div className="color-b">Channel Name</div>

      <input
        name="item_name"
        id="item_name"
        className="form-control mt-1"
        placeholder="e.g. general"
        value={channelName}
        onChange={(e) => setChannelName(e.target.value)}
      />

      <div className="color-b">Private Channel</div>
      <div className="color-7">By making a channel private, only selected roles will have access to read or connect to this channel</div>

      <div className="spacer-10"></div>

      <div className="row mt-3" style={{ justifyContent: 'center' }}>
        <div className="offer-btn" onClick={onClose} style={{ width: 100, marginRight: 20 }}>
          Cancel
        </div>

        <div className={`offer-btn buy-btn ${(!channelName) && 'btn-disabled'}`} onClick={onCreateChannel} style={{ width: 200 }}>
          Create Channel
        </div>
      </div>

    </LayoutModal>
  );
};

export default ModalCreateChannel;
