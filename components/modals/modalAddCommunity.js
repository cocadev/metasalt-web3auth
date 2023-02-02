import React, { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import OutsideClickHandler from 'react-outside-click-handler';
import useWindowSize from '../../hooks/useWindowSize';
import { v4 as uuidv4 } from 'uuid';
import LayoutModal from '../layouts/layoutModal';

const ModalAddCommunity = ({ onClose, onSave, videoId }) => {

  const { Moralis, user } = useMoralis();
  const { data: nftGates } = useMoralisQuery('NFTGates', query => query.equalTo('owner', user?.id || '-').descending('createdAt'));
  const [searchKey, setSearchKey] = useState();
  const [isShow, setIsShow] = useState(false);
  const [removingList, setRemovingList] = useState([]);
  const [addingList, setAddingList] = useState([]);
  const { width } = useWindowSize();
  const [selectedCommunities, setSelectedCommunities] = useState([]);

  const filteredContents = useMemo(() => {
    const contents = nftGates.filter((item) => {
      const contents = JSON.parse(item?.attributes?.contents)
      const videoGated = contents?.find(x => x.link === videoId)
      return !!videoGated
    })
    return contents;
  }, [nftGates])

  useEffect(() => {
    setSelectedCommunities([...filteredContents.map(item => item.id)])
  }, [filteredContents])


  const onAdd = (communityId) => {
    setSelectedCommunities([...selectedCommunities, communityId])
    setRemovingList([...removingList.filter(item => item.id !== communityId)])
    setAddingList([...addingList, communityId])
  }

  const onRemove = (communityId) => {
    const removedList = selectedCommunities.filter(item => item !== communityId);
    setSelectedCommunities(removedList)
    setRemovingList([...removingList, communityId])
    setAddingList([...addingList.filter(item => item.id !== communityId)])
  }

  const onSaveCommunities = async () => {

    const removingIds = removingList.filter(function (obj) { return addingList.indexOf(obj) === -1; });
    const addingIds = addingList.filter(function (obj) { return removingList.indexOf(obj) === -1; });

    if (removingIds.length > 0) {

      removingIds.map(async communityId => {
        const NFTGatesQuery = new Moralis.Query('NFTGates');
        NFTGatesQuery.equalTo('objectId', communityId);
        const object1 = await NFTGatesQuery.first();

        object1.save().then((object) => {
          const oldContents = JSON.parse(object.attributes.contents);
          const newContents = [...oldContents.filter(item => item.link !== videoId)];
          object.set('contents', JSON.stringify(newContents));
          return object.save();
        });
      })
    }

    if (addingIds.length > 0) {
      addingIds.map(async communityId => {
        const NFTGatesQuery = new Moralis.Query('NFTGates');
        NFTGatesQuery.equalTo('objectId', communityId);
        const object1 = await NFTGatesQuery.first();

        object1.save().then((object) => {
          const oldContents = JSON.parse(object.attributes.contents);
          const newContents = [...oldContents, {
            id: uuidv4(),
            type: {
              value: 'video',
              label: 'My Videos'
            },
            title: 'Video',
            link: videoId,
            createdAt: new Date()
          }];
          object.set('contents', JSON.stringify(newContents));
          return object.save();
        });
      })
    }
    onClose();
  }

  return (
    <LayoutModal
      isOpen={true}
      onClose={onClose}
      title={'Add Communities'}
    >

      <div style={{ display: 'flex', flex: 1, position: 'relative', marginLeft: 12, marginRight: 12 }}>

        <img src={'/img/search-black.png'} alt='search-black' style={{ position: 'absolute', top: 12, right: 12 }} />

        <input
          className="top-search main-font"
          placeholder="Search My Communities"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          onClick={() => setIsShow(true)}
          style={{ background: '#333' }}
        />

      </div>

      {isShow && <div
        style={{ boxShadow: '0 0.25rem 0.25rem rgb(0 0 0 / 25%)', padding: 12, background: '#111', maxHeight: 270, marginTop: 12, overflow: 'auto', zIndex: 100 }}>
        <OutsideClickHandler
          onOutsideClick={() => {
            setIsShow(false);
          }}
        >
          {
            nftGates.map((nft, index) => {
              const { img, title } = nft.attributes;
              if (searchKey && !title?.toLowerCase().includes(searchKey?.toLowerCase())) {
                return null
              }

              return (
                <div
                  key={index}
                  className='flex-row items-center flex cursor'
                  onClick={() => {
                    selectedCommunities.includes(nft.id) ? onRemove(nft.id) : onAdd(nft.id)
                  }}
                >

                  <div style={{ width: 50, height: 50 }} className='d-center'>
                    <img src={img} alt="" style={{ width: 'auto', maxHeight: 40, maxWidth: 40 }} />
                  </div>

                  <div style={{ marginLeft: 12, marginTop: 12, flex: 1 }}>
                    {title}
                  </div>

                  {selectedCommunities.includes(nft.id) ? <span
                    className="icon_circle-slelected cursor mt-2"
                    onClick={() => onRemove(nft.id)}
                    style={{ marginRight: 12, fontSize: 24 }}></span>
                    : <span
                      className="icon_circle-empty cursor mt-2"
                      onClick={() => onAdd(nft.id)}
                      style={{ marginRight: 12, fontSize: 24 }}></span>}
                </div>
              )
            })}
        </OutsideClickHandler>

      </div>}

      {!isShow && <div className="d-row flex-wrap items-center mt-3">
        {
          nftGates.map((nft, index) => {
            const { img, title } = nft.attributes;
            if (searchKey && !title?.toLowerCase().includes(searchKey?.toLowerCase())) return null
            if(!selectedCommunities.includes(nft.id)) return null
            return (
              <div key={index} style={{ width: 150, height: 150, border: '1px solid #bbb', margin: 8 }} className='d-center'>
                <div style={{ height: 125 }} className='d-center'>
                  <img src={img} alt="" style={{ maxHeight: 120, maxWidth: 148 }} />
                </div>
                <div className="w-full color-b text-center" style={{ height: 25, overflow: 'hidden' }}>{title}</div>
              </div>)
          })
        }
      </div>}

      <div className="w-full d-center mt-4" onClick={onSaveCommunities}>
        <button className="btn-main">Save</button>
      </div>
    </LayoutModal>
  );
};

export default ModalAddCommunity;
