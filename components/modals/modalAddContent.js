import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CONTENTTYPES } from '../../constants/dropdownlist';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import CustomThumbnailSmallVideo from '../custom/CustomThumbnailSmallVideo';
import LayoutModal from '../layouts/layoutModal';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';
import ModalAddNFTCommunity from './modalAddNFTCommunity';
import GatedNFTDisplayNew from '../cards/GatedNFTDisplayNew';

const ButtonBox = styled.div`
  width: 160px;
  height: 41px;
  border: 1px solid #444;
  border-radius: 5px;
  margin: 4px 10px 4px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #bbb;
  cursor: pointer;
  ${props => props.active &&
    css`
      background: #0075ff;
      color: #fff;
      border: none;
    `
  }
`

const Title = styled.div`
  font-size: 17px;
  font-weight: 500;
  color: #bbb;
`

const ModalAddContent = ({ onClose, editData, onSave, addedContent }) => {

  const { user } = useMoralis();
  const account = user?.id;
  const router = useRouter();
  const [type, setType] = useState();
  const [contentTitle, setContentTitle] = useState();
  const [contentLink, setContentLink] = useState();
  const [trigger, setTrigger] = useState(1);
  const { data: videoData } = useMoralisQuery('Videos', query => query.equalTo('owner', account || '-'), [account, trigger]);
  const { data: discourseData } = useMoralisQuery('DiscourseServers', query => query.equalTo('owner', account || '-'), [account, trigger]);
  const { data: musicData } = useMoralisQuery('Musics', query => query.equalTo('owner', account || '-'), [account, trigger]);

  const [isModalNFT, setIsModalNFT] = useState(false);
  const [addedNFT, setAddedNFT] = useState([]);

  useEffect(() => {
    if (editData) {
      setType(editData.type);
      setContentTitle(editData.title);
      setContentLink(editData.link);
      setAddedNFT(editData.nfts);
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setTrigger(trigger + 1)
    }, 1000)
  }, [account])

  const onSaveData = async () => {

    const newData = {
      id: uuidv4(),
      type,
      title: contentTitle,
      link: contentLink,
      createdAt: new Date(),
      nfts: addedNFT
    };

    let content;

    if (editData) {
      const newAddedContent = addedContent.filter(t => t.id !== editData.id);
      content = [...newAddedContent, newData]
    } else {
      content = [...addedContent, newData]
    }

    onSave(content)
    onClose();
  }

  const onCloseNFTModal = () => {
    setIsModalNFT(false);
  }

  return (
    <LayoutModal
      isOpen={true}
      onClose={onClose}
      title={editData ? 'Edit Content' : 'Add Content'}
    >

      <h3 className="text-center color-sky" />

      <div className="w-full flex flex-col" style={{ alignItems: 'flex-start' }}>
        <Title>What do you wanna add?</Title>
        <div className='flex flex-wrap'>
          {
            CONTENTTYPES.map((item, p) => <ButtonBox key={p} active={type?.value === item?.value}
              onClick={() => {
                setType(item);
                setContentLink();
              }}>
              <img src={'/img/icons/' + item.icon} alt="icon" style={{ width: 26, marginRight: 7 }} />
              <span className="f-16">{item.label}</span>
            </ButtonBox>
            )
          }
        </div>

        <div className='w-full'>
          <br />
          {type && <Title>Set a title</Title>}
          {type && <input
            className="form-control"
            placeholder='e.g. exclusive video'
            value={contentTitle}
            onChange={e => setContentTitle(e.target.value)}
          />}

          {type && type?.value !== 'video' && type?.value !== 'Discord' && type?.value !== 'Music' && <Title>Add a link</Title>}
          {type && type?.value !== 'video' && type?.value !== 'Discord' && type?.value !== 'Music' && <input
            className="form-control"
            placeholder='add a link about your content.'
            value={contentLink}
            onChange={e => setContentLink(e.target.value)}
          />}

          {type?.value === 'video' && <div className="container d-flex flex-row flex-wrap ">
            {
              videoData.map((item, index) =>
                <CustomThumbnailSmallVideo
                  key={index}
                  videoId={item.attributes.videoId}
                  checkable={true}
                  onChange={e => setContentLink(e)}
                  thumbnail={item.attributes.thumbnail}
                  contentLink={contentLink}
                />)
            }

            {videoData.length === 0 && <div>
              <p className="text-danger">User does not have any videos to add to community page</p>
              <div
                style={{ width: 80, height: 80, border: '2px dashed #bbb' }}
                className='d-center cursor'
                onClick={() => router.push('/myvideos', undefined, { shallow: true })}
              >
                <span className="icon_plus_alt2 f-24" />
              </div>
            </div>
            }
          </div>}

          {type?.value === 'Discord' && <div className="container d-flex flex-row flex-wrap ">
            {
              discourseData.map((item, index) =>
                <div key={index} className='cursor' style={{ padding: '5px 12px', border: '1px solid #444', borderRadius: 4, margin: 4, background: contentLink === item.id ? '#0075ff' : 'transparent', color: '#fff' }} onClick={() => setContentLink(item.id)}>
                  <img src={'/img/icons/ic_discord.png'} alt="icon" style={{ width: 22, marginRight: 7 }} />
                  {item.attributes.title}
                </div>
              )

            }

            {discourseData.length === 0 && <div>
              <p className="text-danger">User does not have any discourse to add to community page</p>
            </div>
            }
          </div>}


          {type?.value === 'Music' && <div className="container d-flex flex-row flex-wrap ">
            {
              musicData.map((item, index) =>
                <div key={index} className='cursor' style={{ padding: '5px 12px', border: '1px solid #444', borderRadius: 4, margin: 4, background: contentLink === item.id ? '#0075ff' : 'transparent', color: '#fff' }} onClick={() => setContentLink(item.id)}>
                  <img src={'/img/icons/ic_music.png'} alt="icon" style={{ width: 18, marginRight: 7 }} />
                  {item.attributes.title}
                </div>
              )
            }

            {musicData.length === 0 && <div>
              <p className="text-danger">User does not have any music to add to community page</p>
            </div>
            }
          </div>}

        </div>

      </div>

      <div className="spacer-single mb-1" />

      {
        addedNFT.length > 0
          ? <GatedNFTDisplayNew 
              data={addedNFT} 
              editable 
              setAddedNFT={setAddedNFT}
            />
          : <div className="text-center">No nfts Added!</div>
      }

      <div className="row mt-3" style={{ justifyContent: 'center' }}>

        <div className="offer-btn" onClick={() => { setIsModalNFT(true) }} style={{ width: 120, marginRight: 20 }}>
          Add NFT
        </div>

        <div
          className={`offer-btn buy-btn ${(!type || !contentTitle || !contentLink) && 'btn-disabled'}`}
          onClick={onSaveData}
          style={{ width: 200 }}
        >
          Save
        </div>
      </div>


      {
        isModalNFT &&
        <ModalAddNFTCommunity
          onClose={onCloseNFTModal}
          setAddedNFT={setAddedNFT}
          addedNFT={addedNFT}
        />
      }

    </LayoutModal>
  );
};

export default ModalAddContent;