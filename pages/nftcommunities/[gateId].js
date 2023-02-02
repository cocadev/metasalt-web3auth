import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import renderHTML from 'react-render-html';
import moment from 'moment';
import { useMoralis, useMoralisCloudFunction, useMoralisQuery } from 'react-moralis';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../store/actions/notifications/notifications';
import LayoutPage from '../../components/layouts/layoutPage';
import { BlackLoading } from '../../components/loading';
import { CustomDropDown } from '../../components/custom/customDropDown';
import UtilService from '../../sip/utilService';
import { GATESTATUS, GATETYPES } from '../../constants/dropdownlist';
import { DEMO_AVATAR } from '../../keys';
import { InfuraAuth, InfuraLink } from '../../keys';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { onLikes } from '../../common/web3Api';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
const NFTCommunity = dynamic(() => import('../../components/cards/NFTCommnuity'));
const ModalAddContent = dynamic(() => import('../../components/modals/modalAddContent'));
const ModalDeleteCommunity = dynamic(() => import('../../components/modals/modalDeleteCommunity'));

const EditIcon = styled.div`
  position: absolute;
  cursor: pointer;
  background: #333;
  right: 12px;
  margin-top: -30px;
  padding: 8px;
  border-radius: 25px;
`

const GatedDetail = function () {

  const router = useRouter();
  const dispatch = useDispatch();
  const { account, Moralis, user } = useMoralis();
  const [trigger, setTrigger] = useState(0);
  const [editBaseImg, setEditBaseImg] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTitleContent, setIsTitleContent] = useState(true);
  const [isTitleDescription, setIsTitleDescription] = useState(true);
  const [isTitleDetails, setIsTitleDetails] = useState(true);
  const [fullBrand, setFullBrand] = useState();
  const [fullCollection, setFullCollection] = useState();
  const [editable, setEditable] = useState(false);
  const [isModalContent, setIsModalContent] = useState(null);
  const [isRemoveModal, setIsRemoveModal] = useState(false);
  const [editData, setEditData] = useState();
  const [gatedEditData, setGatedEditData] = useState({
    file: null,
    baseFile: null,
    gateType: null,
    gateStatus: null,
    gateBrand: null,
    gateCollection: null,
    title: null,
    description: null,
    image: null,
    addedContent: null,
    startDate: null,
  });

  const gatedId = router.query.gateId;
  const { data: users } = useMoralisCloudFunction('loadUsers');
  const { data: verificationData } = useMoralisQuery('Verification', query => query.equalTo('verifier', account).equalTo('tokenURI', gatedId).limit(1));
  const { data: gatedData } = useMoralisQuery('NFTGates', query => query.equalTo('objectId', gatedId), [trigger]);
  const { data: likes } = useMoralisQuery('AllLikes', query => query.equalTo('itemId', gatedId), [trigger, user], { autoFetch: true });
  const isLike = likes.find(item => item.attributes.userId === user?.id);

  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })

  const myNFT = gatedData[0]?.attributes;

  const { img, title, brand, collection, status, type, description, contents, date, owner } = myNFT || {};
  const me = users?.find(z => z.id === owner);

  const onClose = () => {
    setIsModalContent(false);
  }

  useEffect(() => {
    onInitialGate();
  }, [title])

  useEffect(() => {
    setTimeout(() => {
      setTrigger(trigger + 1)
    }, 1000)
  }, [])

  useEffect(() => {
    brand && onGetBrand(brand)
    collection && onGetCollection(collection);
  }, [brand, collection])

  const onInitialGate = () => {
    setGatedEditData({
      file: null,
      baseFile: null,
      gateType: type,
      gateStatus: status,
      gateBrand: brand,
      gateCollection: collection,
      title: title,
      description: description,
      image: img,
      addedContent: JSON.parse(contents || '[]'),
      startDate: date
    })
  }

  async function onGetBrand(x) {
    const RealBrandsQuery = new Moralis.Query('RealBrands');
    RealBrandsQuery.equalTo('objectId', x);
    const object = await RealBrandsQuery.first();
    setFullBrand({ ...object?.attributes, ...{ id: object?.id } });
  }

  async function onGetCollection(x) {
    const CollectionsQuery = new Moralis.Query('Brands');
    CollectionsQuery.equalTo('objectId', x);
    const object = await CollectionsQuery.first();
    setFullCollection({ ...object?.attributes, ...{ id: object?.id } });
  }

  const onSaveGated = async () => {
    const { title, description, gateStatus, gateType, startDate, addedContent, image } = gatedEditData;

    if ((!title) || (!description) || (addedContent.length === 0)) {
      const note = UtilService.validateGatedEdit(title, description, addedContent);
      dispatch(addNotification(note, 'error'))
      return false
    }
    setIsLoading(true);
    let editImage = image;

    if (editFile) {
      const result = await ipfs.add(editFile);
      editImage = 'ipfs://' + result.path;
    }

    const NFTGatesQuery = new Moralis.Query('NFTGates');
    NFTGatesQuery.equalTo('objectId', gatedId);
    const object = await NFTGatesQuery.first();

    const request = {
      title,
      description,
      status: gateStatus,
      type: gateType,
      date: startDate,
      contents: JSON.stringify(addedContent),
      img: editImage
    }

    await object.save(request)
    setIsLoading(false);

    setTrigger(trigger + 1);
    setEditable(false)
    dispatch(addNotification('Update successful', 'success'))

  }

  const addedContent = gatedEditData?.addedContent;

  const onCloseGated = () => {
    onInitialGate();
    setEditable(false);
    setEditBaseImg(null);
    setEditFile(null);
  }

  const onChangeFile = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await UtilService.convertBase64(file);
      setEditBaseImg(base64)
      setEditFile(file);
    }
  };

  const onLikeCommunity = async () => {
    const request = { Moralis, itemId: gatedId, user, type: 'community', router, follow: false }
    dispatch(onLikes(request, () => {
      setTrigger(trigger + 1);
    }))
  }

  return (
    <LayoutPage>

      {isLoading && <BlackLoading />}

      <div className='d-center'>
        <div className='m-3 container'>
          <br />

          <div className='row mt-md-5'>
            <div className='col-md-5 text-center' style={{ padding: 18, position: 'relative' }}>
              {verificationData.length > 0 && <img src={'../img/approval.png'} alt='lazy' style={{ width: 70, position: 'absolute', right: 0, top: -15, background: '#fff', borderRadius: 35 }} />}

              <img src={UtilService.ConvetImg(editBaseImg || img)} alt='' style={{ height: 'auto', maxWidth: '100%' }} />

              {editable && <EditIcon>
                <img
                  src={'/img/icons/pencil.png'}
                  alt=''
                  style={{ width: 25 }}
                  onClick={() => document.getElementById('file').click()}
                />
                <input type='file' id='file' className='d-none' onChange={onChangeFile} />
              </EditIcon>}

              <div className='offer-title' onClick={() => setIsTitleDescription(!isTitleDescription)}>
                <div><span aria-hidden='true' className='icon_menu' />&nbsp;&nbsp;Detail</div>
                <span aria-hidden='true' className={`arrow_carrot-${!isTitleDescription ? 'down' : 'up'} text24`} />
              </div>

              {isTitleDescription && <div className='offer-body'>
                {!editable ? <div>{title}</div> :
                  <input
                    className='form-control'
                    placeholder='title'
                    value={gatedEditData.title}
                    onChange={e => setGatedEditData({ ...gatedEditData, title: e.target.value })}
                  />}

                <div className='mt-2 w-full text-start'>
                  {!editable && description && renderHTML(description)}
                  {editable && <ReactQuill
                    className='w-100 text-white'
                    style={{ minHeight: '150px' }}
                    value={gatedEditData.description}
                    onChange={e => setGatedEditData({ ...gatedEditData, description: e })}
                  />}
                </div>
              </div>}

              <div className='offer-title' onClick={() => setIsTitleDetails(!isTitleDetails)}>
                <div><span aria-hidden='true' className='icon_building' />&nbsp;&nbsp;Status</div>
                <span aria-hidden='true' className={`arrow_carrot-${!isTitleDetails ? 'down' : 'up'} text24`} />
              </div>

              {isTitleDetails && <div className='offer-body'>
                <div className='mt-2 flex flex-row justify-betwen w-full'>
                  <div>Status</div>
                  <div>
                    {!editable ? status :
                      <CustomDropDown
                        LIST={GATESTATUS}
                        data={gatedEditData.gateStatus}
                        onChangeData={x => setGatedEditData({ ...gatedEditData, gateStatus: x })}
                      />}
                  </div>
                </div>
                <div className='mt-2 flex flex-row justify-betwen w-full'>
                  <div>Type</div>
                  <div>{!editable ? type :
                    <CustomDropDown
                      LIST={GATETYPES}
                      data={gatedEditData.gateType}
                      onChangeData={x => setGatedEditData({ ...gatedEditData, gateType: x })}
                    />}</div>
                </div>
                <div className='mt-2 flex flex-row justify-betwen w-full'>
                  <div>Date</div>
                  <div>{!editable ? moment(date).format('L, LT') : <DatePicker
                    selected={gatedEditData.startDate}
                    onChange={(x) => setGatedEditData({ ...gatedEditData, startDate: x })}
                    placeholderText='Please select the date!'
                  />}</div>
                </div>
              </div>}
            </div>

            <div className='col-md-7'>
              <div className='item_info p-10 relative'>

                {owner === user?.id && myNFT && <>
                  {editable ? <div className='position-absolute' style={{ right: 12 }}>
                    <div
                      className='btn btn-primary cursor'
                      style={{ marginLeft: 12 }}
                      onClick={onSaveGated}>
                      Save
                    </div>
                    <div
                      className='btn btn-secondary cursor'
                      style={{ marginLeft: 12 }}
                      onClick={onCloseGated}>
                      Cancel
                    </div>
                  </div> :
                    <img
                      src={'/img/icons/pencil.png'}
                      className='position-absolute cursor'
                      alt=''
                      style={{ right: 12, width: 40 }}
                      onClick={() => setEditable(true)}
                    />}
                </>}

                <h2 className='color-b'>{title || 'Metasalt Token'}</h2>
                
                <div className='color-b d-row align-center'>
                  Created by &nbsp;
                  <span style={{ color: '#2082e1', cursor: 'pointer' }} onClick={() => router.push(`/sales/${me?.attributes?.ethAddress}`, undefined, { shallow: true })}>
                    {me?.attributes?.username || '-'}
                  </span>
                  <div onClick={onLikeCommunity} className='cursor ml-5'>
                    <span style={{ marginRight: 12, color: isLike ? '#ff343f' : '#666' }} aria-hidden="true" className="icon_heart"></span>
                    {likes?.length || 0} favorites
                  </div>
                </div>

                <div className='mt-3 br-8 flex flex-row color-b' style={{ background: '#111', border: '1px solid #222' }}>

                  {brand && <div className='d-row f-1 ml-10 mb-10' >
                    <img
                      className='mt-2 cursor'
                      src={UtilService.ConvetImg(fullBrand?.avatar) || DEMO_AVATAR}
                      alt='avatar'
                      style={{ width: 50, height: 50, borderRadius: 25, objectFit: 'cover' }}
                      onClick={() => router.push(`/brands/${fullBrand?.id}`, undefined, { shallow: true })}
                    />
                    <div style={{ marginLeft: 10 }}>
                      <div className='mt-16' style={{ fontWeight: '600' }}>Brand</div>
                      <div style={{ fontSize: 12 }}>{fullBrand?.title}</div>
                    </div>
                  </div>}

                  <div className='d-row f-1 ml-10 mb-10' >
                    <img
                      className='mt-2 cursor'
                      src={UtilService.ConvetImg(fullCollection?.avatar) || DEMO_AVATAR}
                      alt='avatar'
                      style={{ width: 50, height: 50, borderRadius: 25, objectFit: 'cover' }}
                      onClick={() => router.push(`/subCollection/${fullCollection?.id}`, undefined, { shallow: true })}
                    />
                    <div style={{ marginLeft: 10 }}>
                      <div className='mt-16' style={{ fontWeight: '600' }}>Collection</div>
                      <div style={{ fontSize: 12 }}>{fullCollection?.title}</div>
                    </div>
                  </div>
                </div>

                <div className='offer-title' onClick={() => setIsTitleContent(!isTitleContent)}>
                  <div><span aria-hidden='true' className='icon_tag_alt' />&nbsp;&nbsp;Contents</div>
                  <span aria-hidden='true' className={`arrow_carrot-${!isTitleContent ? 'down' : 'up'} text24`} />
                </div>

                {isTitleContent && <div className='offer-body'>
                  <div className='w-full'>

                    {editable && <button
                      className='btn btn-primary'
                      onClick={() => {
                        setIsModalContent(true);
                        setEditData(null);
                      }}
                    >
                      + Add Content
                    </button>}

                    <NFTCommunity
                      content={addedContent}
                      editable={editable}
                      onEdit={(e) => {
                        setEditData(e);
                        setIsModalContent(true)
                      }}
                      onRemove={(e) => {
                        setGatedEditData({ ...gatedEditData, addedContent: addedContent.filter((x, k) => k !== e) })
                      }}
                    />
                  </div>

                </div>}
              </div>

              {
                owner === user?.id && myNFT &&
                <button
                  className='btn btn-danger mt-2 ml-2'
                  onClick={() => setIsRemoveModal(true)}
                >
                  Remove Community
                </button>
              }

            </div>

          </div>
        </div>
      </div>

      {
        isRemoveModal &&
        <ModalDeleteCommunity
          onClose={() => setIsRemoveModal(false)}
          onSuccess={() => { }}
          gatedId={gatedId}
        />
      }

      {
        isModalContent &&
        <ModalAddContent
          onClose={onClose}
          editData={editData}
          addedContent={gatedEditData.addedContent}
          onSave={e => setGatedEditData({ ...gatedEditData, addedContent: e })}
        />
      }

    </LayoutPage>
  );
}

export default GatedDetail;