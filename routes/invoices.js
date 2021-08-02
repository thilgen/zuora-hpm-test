var express = require('express');
var router = express.Router();

var auth = require('../util/auth');
var axios = require('axios')
var zuora = require('../util/zuora_endpoints');

router.get('/', async function(req, res, next) {
  const authTokenResponse = await auth.getAuthToken();
  let access_token = authTokenResponse.data.access_token;

  let zuoraAccountId = "2c92c0f87a9eddeb017aa775e16431ff"

  let response = await axios({
    method: 'get',
    url: zuora.ENDPOINT + '/v1/billing-documents?accountId=' + zuoraAccountId,
    headers: {
      'Authorization': 'Bearer ' + access_token
    }
  });
  var invoiceData = []
  for (var idx in response.data.documents) {
    if (response.data.documents[idx].documentType = 'Invoice') {
      invoiceData.push(response.data.documents[idx])
    }
  }
  res.json({invoices: invoiceData});
});

module.exports = router;
