import * as AWS from 'aws-sdk';
import Deso from 'deso-protocol';
import FormData from 'form-data';
import fetch from 'node-fetch';

const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';
const SORT_KEY = process.env.SORT_KEY || '';
const SPATIUM_PUBLISHER_KEY = "BC1YLjC6xgSaoesmZmBgAWFxuxVTAaaAySQbiuSnCfb5eBBiWs4QgfP";
const ADMIN_KEY = process.env.ADMIN_KEY || '';

const db = new AWS.DynamoDB.DocumentClient();
const deso = new Deso();

export const handler = async () => {

  // 1. Get all books from the DB
  const params = {
    TableName: TABLE_NAME,
  };
  const books = await db.scan(params).promise().catch(dbError => {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  });

  let booksMap = new Map();
  let deleteMeMap = [];
  let paymentMap = new Map();

  // 2. Go through each postHashHex and add to a HashMap all serials
  books.Items.forEach(book => {
    if (!booksMap.has(book[PRIMARY_KEY])) {
      booksMap.set(book[PRIMARY_KEY], new Array());
    }
    booksMap.get(book[PRIMARY_KEY]).push(book[SORT_KEY]);
  });

  // 3. Go through each postHashHex in HashMap and check Deso for any serials not owned
  //    by SpatiumPublisher anymore. Cross reference with the HashMap and add to a deleteMeMap
  for (let postHashHex of booksMap.keys()) {
    const request = {
      "PostHashHex": postHashHex
    };
    const nftEntries = await deso.nft.getNftEntriesForPostHash(request);
    const nfts = nftEntries !== null ? nftEntries['NFTEntryResponses'] : [];
    nfts.forEach(nft => {
      if (nft['OwnerPublicKeyBase58Check'] !== SPATIUM_PUBLISHER_KEY && booksMap.get(postHashHex).includes(nft['SerialNumber'].toString())) {
        if (!paymentMap.has(postHashHex)) {
          paymentMap.set(postHashHex, 0);
        }
        paymentMap.set(postHashHex, paymentMap.get(postHashHex) + nft['LastAcceptedBidAmountNanos']);
        deleteMeMap.push(
          {
            DeleteRequest: {
              Key: {
                [PRIMARY_KEY]: postHashHex,
                [SORT_KEY]: nft['SerialNumber'].toString(),
              },

            }
          }
        );
      }
    });
  };
  // 4. Pay authors
  for (var postHashHex of paymentMap.keys()) {
    const formData = new FormData();
    formData.append('api_key', ADMIN_KEY);
    formData.append('post_hash_hex', postHashHex);
    formData.append('amount', paymentMap.get(postHashHex));
    const requestOptions = {
      method: 'POST',
      body: formData,
    };
    let uri = 'https://api.spatiumstories.xyz';
    const response = await fetch(`${uri}/api/pay-author`, requestOptions)
    .then(response => response.text())
    .then(data => {
      console.log(data);
    }).catch(e => {
        console.log(e);
    });  
  }

  // 5. Go through the deleteMeMap and do:
  
  const deleteAllParams = {
    RequestItems: {
      [TABLE_NAME]: deleteMeMap
    }
  };

  try {
    db.batchWrite(deleteAllParams).promise();
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }

  return { statusCode: 200, body: JSON.stringify(deleteMeMap) };
};