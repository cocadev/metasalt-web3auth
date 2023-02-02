import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { TinyLoading } from '../../components/loading';
import { onRemoveGated, onUpdateGated } from '../../store/actions/nfts/nfts';
import { addNotification } from '../../store/actions/notifications/notifications';
import { useMoralis } from 'react-moralis';
import useWindowSize from '../../hooks/useWindowSize';
import { useRouter } from "next/router";
import { InfuraAuth, InfuraLink } from '../../keys';
import { create as ipfsHttpClient } from 'ipfs-http-client';

function GateStep5({onFinish}) {

  const { Moralis, user } = useMoralis();
  const { width } = useWindowSize();
  const dispatch = useDispatch();
  const router = useRouter();
  const { gated } = useSelector(state => state.nfts);
  const { title, baseFile, file, description, brand, collection, gateType, gateStatus, addedContent, startDate, andOrList } = gated;
  const [isLoading, setIsLoading] = useState(false);
  const ipfs = ipfsHttpClient({ url: InfuraLink, headers: { authorization: InfuraAuth } })

  const onCreateNFT = async () => {
    if (title && baseFile && description && brand && collection && gateType && gateStatus) {
      setIsLoading(true);
      const result = await ipfs.add(file);
      const img = 'ipfs://' + result.path;
      const NFTGates = Moralis.Object.extend("NFTGates");
      const nFTGates = new NFTGates();
      await nFTGates.save({
        title,
        img,
        description,
        brand: brand.value,
        collection: collection.value,
        type: gateType?.label,
        status: gateStatus?.label,
        contents: JSON.stringify(addedContent),
        date: startDate,
        owner: user?.id,
        andOrList: JSON.stringify(andOrList)
      })
      dispatch(onRemoveGated())
      setIsLoading(false);
      dispatch(addNotification('Create successful', 'success'))

      onFinish();
      setTimeout(()=>{
        router.push('/nftcommunities', undefined, { shallow: true });
      }, 5000)

    } else {
      dispatch(addNotification('Validation Error!', 'error'))
    }
  }

  const onEdit = () => {
    dispatch(onUpdateGated({ step: 1 }))
  }

  return (
    <div className="col-lg-11 m-auto">
      <h2 className="text-white">Review My NFT Community</h2>
      {width > 850 && <table className='w-full mt-4'>
        <tr>
          <th>Image</th>
          <th>Title</th>
          <th>Type</th>
          <th>Brand</th>
          <th>Collection</th>
          <th>Status</th>
        </tr>
        <tr>
          <td><img src={baseFile} alt='pic' style={{ maxWidth: 80, maxHeight: 80 }} /></td>
          <td>{title}</td>
          <td>{gateType?.label}</td>
          <td>{brand?.label}</td>
          <td>{collection?.label}</td>
          <td>{gateStatus?.label}</td>
        </tr>
      </table>}

      {
        width <= 850 && <div>
          <img src={baseFile} alt='pic' style={{ maxWidth: 200, maxHeight: 200 }} />
          <div>Title: {title}</div>
          <div>Type: {gateType?.label}</div>
          <div>Brand: {brand?.label}</div>
          <div>Collection: {collection?.label}</div>
          <div>Status: {gateStatus?.label}</div>
        </div>
      }

      <div className="d-flex my-4">
        <button className={`btn btn-primary`} onClick={onEdit}>Edit</button>
        {isLoading ? <TinyLoading /> : <button className={`btn btn-primary ml-4`} onClick={onCreateNFT}>Finish</button>}
      </div>

    </div>
  )
}

export default GateStep5;