import React, { useEffect, useState } from 'react';
import { Carousel } from '3d-react-carousal';


const slides = [
  <picture><img src="https://picsum.photos/800/300/?random" alt="1" /></picture>,
  <picture><img src="https://picsum.photos/800/301/?random" alt="2" /></picture>,
  <picture><img src="https://picsum.photos/800/302/?random" alt="3" /></picture>,
  <picture><img src="https://picsum.photos/800/303/?random" alt="4" /></picture>,
  <picture><img src="https://picsum.photos/800/304/?random" alt="5" /></picture>,
];


const LiveStreamCarousel = () => {
  
  const [showArrows, setShowArrows] = useState(false)
  
  useEffect(() => {
    setTimeout(() => {
      setShowArrows(true)
    }, 3000)
  }, [])
  
  return (
    <Carousel slides={slides} arrows={showArrows} />
  )
};

export default LiveStreamCarousel;
