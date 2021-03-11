// Sanity check
// const refreshTokens = async (req, res) => {
//   try {
//     console.log('abc');
//     res.json({
//       a:'a',
//       b: 'b',
//       c:'c'
//     });
//   } catch (error) {
//     console.log(error);
//     res.send(error);
//   }
// };
  


// const refreshTokens = async (req, res) => {
//   try {
//     const body = await got.post("https://msp-phac.smapply.io/api/o/token/", {
//       json: {
//         grant_type: "refresh_token",
//         client_id: client_id,
//         client_secret: client_secret,
//         refresh_token: refresh_token
//       },
//       responseType: "json",
//     });

//     console.log(body);
//     res.json(body);
//   } catch (error) {
//     console.log(error);
//     res.send(error);
//   }
// };