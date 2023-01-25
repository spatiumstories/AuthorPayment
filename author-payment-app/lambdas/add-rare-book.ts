import * as AWS from 'aws-sdk';
import Deso from 'deso-protocol';

const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';
const SORT_KEY = process.env.SORT_KEY || '';

const db = new AWS.DynamoDB.DocumentClient();
const deso = new Deso();


export const handler = async (event: any = {}): Promise<any> => {


  if (!event.body) {
    return { statusCode: 400, body: 'invalid request, you are missing the parameter body' };
  }
  const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
  const postHashHex = item[PRIMARY_KEY];
  const request = {
    "PostHashHex": postHashHex
  };
  console.log("Getting NFTs for " + postHashHex);
  const nfts = await deso.nft.getNftCollectionSummary(request);
  let numSerials = 0;
  
  try {
    numSerials = nfts !== null ? nfts['NFTCollectionResponse']!['NumCopiesForSale'] : 0;
  } catch (err) {
    console.log("Error!!! " + err);
    return {statusCode: 500, body: JSON.stringify(err)};
  }

  try {
    for (var i = 1; i <= numSerials; i++) {
      item[SORT_KEY] = i.toString();
      const nft_param = {
          TableName: TABLE_NAME,    
          Item: item
      };
      await db.put(nft_param).promise();
    }
    return {statusCode: 200, body: "Success!"}
  } catch (dbError) {
    return {statusCode: 500, body: JSON.stringify(dbError)}
  }
};
