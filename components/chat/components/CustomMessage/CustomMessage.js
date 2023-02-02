import React from 'react';
import { MessageSimple } from 'stream-chat-react';

const CustomMessage = (props) => {
  return (
    <>
      <MessageSimple {...props} />
    </>
  );
};

export default CustomMessage;
