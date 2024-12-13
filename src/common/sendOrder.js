import axios from "axios";

export const sendOrder = async (type, date, goods, address) => {
  let message = `
  ${date}\n\n${type}:\n\n${goods.toString()}
  `
  if(goods.length > 0) {
    
    await axios
    .post(
      'https://api.telegram.org/bot7275423419:AAGDxY6uqtmMxO3xFzKbMKRhxyfr9W9RjHY/sendMessage',
      {
        chat_id:  address === 'Ленина' ? '-1002160395531' : address === 'Парковая' ? '-1002176676370' : '',
        text: message,
      },
    )
    .then((res) => {
      console.log(res)
    })  
    .catch((err) => {
      console.warn(err);
    });
  }
};