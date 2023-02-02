import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useMoralis, useMoralisQuery } from 'react-moralis';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../store/actions/notifications/notifications';
import LayoutPage from '../../../components/layouts/layoutPage';
import { TinyLoading } from '../../../components/loading';
import UtilService from '../../../sip/utilService';
import { Title } from '../../../constants/globalCss'
import GatedNFTDisplayNew from '../../../components/cards/GatedNFTDisplayNew';
import ModalAddNFTCommunity from '../../../components/modals/modalAddNFTCommunity';
import { CATEGORIES_COLLECTIONS } from '../../../constants/hotCollections';
import { DropdownStyles } from '../../../constants/dropdownlist';
import Select from 'react-select';
import CustomDisplayVideo from '../../../components/custom/CustomDisplayVideo';

const EditVideoPage = () => {

  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { Moralis, user } = useMoralis();
  const [file, setFile] = useState();
  const [baseFile, setBaseFile] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isCongrat, setIsCongrat] = useState(false);
  const [addedNFT, setAddedNFT] = useState([]);
  const [isModalNFT, setIsModalNFT] = useState(false);
  const [category, setCategory] = useState();
  const { data } = useMoralisQuery('Videos', query => query.equalTo('objectId', id).limit(1), [id]);
  const { title: serverTitle, description: serverDescription, category: serverCategory, addedNFT: serverNFT } = data[0]?.attributes || '-';

  useEffect(() => {
    setTitle(serverTitle);
    setDescription(serverDescription);
    const filterCategory = CATEGORIES_COLLECTIONS.find(item => item.value === serverCategory);
    setCategory({ value: serverCategory, label: filterCategory?.label });
    serverNFT && setAddedNFT(JSON.parse(serverNFT));
  }, [data])


  const onChangeFile = async (e) => {
    let uploadFile = e.target.files[0];

    if (uploadFile) {
      const base64 = await UtilService.convertBase64(uploadFile);
      setBaseFile(base64)
      setFile(uploadFile);
    }
  };

  const onUpdateVideo = async () => {

    if (!title || !description || !category) {
      const param = !title ? 'Title' : !description ? 'Description' : 'Category';
      dispatch(addNotification(`${param} is not optional`, 'error'))
      return false;
    }
    setIsLoading(true);
    const Videos = new Moralis.Query('Videos');
    Videos.equalTo('objectId', id);
    const object = await Videos.first();
    await object.save()
      .then((x) => {
        x.set('title', title);
        x.set('description', description);
        x.set('category', category?.value);
        x.set('addedNFT', JSON.stringify(addedNFT));
        dispatch(addNotification('Update successful', 'success'))
        setIsCongrat(true);
        setTimeout(() => {
          router.back();
        }, 2000)
        return x.save();
      }, (error) => {
        dispatch(addNotification('Sorry! Failed to update the server. Try again', 'error'))
      });
      setIsLoading(false);

  }

  const handleCategory = (e) => {
    setCategory({ value: e.value, label: e.label });
  }

  const onCancel = () => {
    setFile();
    setBaseFile();
    setTitle('');
    setDescription('');
  }

  return (
    <LayoutPage container congrat={isCongrat}>

      <section>
        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <form id="form-create-item" className="form-border" action="#">
              <div className="field-set">
                <Title left>Update The Video</Title>

                <div className="spacer-single" />

                <h5 className="color-b">Title</h5>
                <input
                  className="form-control"
                  placeholder="Video Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />

                <div className="spacer-10" />

                <h5 className="color-b">Description</h5>
                <textarea
                  className="form-control"
                  placeholder="Video Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />

                <div className="spacer-10" />

                <h5 className="color-b">Category</h5>
                <Select
                  value={category}
                  styles={DropdownStyles}
                  menuContainerStyle={{ 'zIndex': 999 }}
                  options={[...CATEGORIES_COLLECTIONS]}
                  onChange={handleCategory}
                />

                <div className="spacer-30" />

                <div className="d-row ">
                  {!isLoading ? <div className="offer-btn buy-btn" onClick={onUpdateVideo} style={{ width: 100 }}>
                    Save
                  </div> : <TinyLoading />}

                  <div
                    className="ml-4 offer-btn color-b"
                    style={{ width: 100 }}
                    onClick={() => onCancel()}
                  >Cancel</div>
                </div>

              </div>

            </form>
          </div>

          <div className="col-lg-4 col-sm-12 col-xs-12">

            {title && <CustomDisplayVideo
              item={data[0]}
              visibleOnly
            />}

            {baseFile && <div className='d-center'>
              <div className="my-3 mx-auto d-center">
                <div className="btn-main" onClick={e => document.getElementById('file').click()}>
                  <input type="file" id="file" className='d-none' onChange={onChangeFile} />
                  <span aria-hidden="true" className="icon_pencil" />
                </div>
              </div>
            </div>}

            <div className='spacer-single' />

            <GatedNFTDisplayNew
              data={addedNFT}
              editable
              setAddedNFT={setAddedNFT}
            />

            <div className='d-center'>
              <div className="btn-main mt-2 cursor" style={{ padding: '5px 24px' }} onClick={() => setIsModalNFT(true)} >
                <span aria-hidden="true" className="icon_pencil" />
              </div>
            </div>

            <br />

          </div>
        </div>
      </section>

      {
        isModalNFT &&
        <ModalAddNFTCommunity
          onClose={() => setIsModalNFT(false)}
          setAddedNFT={setAddedNFT}
          addedNFT={addedNFT}
        />
      }

    </LayoutPage>
  );
}

export default EditVideoPage;