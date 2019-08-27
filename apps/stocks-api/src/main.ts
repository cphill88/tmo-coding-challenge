/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';

const Wreck = require('@hapi/wreck');

//Started writing server method to get stock data and cache it. Still need to pass in the correct parameters from the call in angular.
const getStockData = async function() {
  const { res, payload } = await Wreck.get('https://sandbox.iexapis.com');
  return JSON.parse(payload);
};

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost'
  });

  server.method('getStockData', getStockData, {
    cache: {
      expiresIn: 60000
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return {
        hello: 'world'
      };
    }
  });

  //Handler that would call getStockData
  // server.route({
  //   handler: (request, h) => {
  //     server.methods.getStockData(function(error, result) {
  //       reply(error || result);
  //     });
  //   }
  // });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
