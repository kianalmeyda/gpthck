const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3005;
const axios = require("axios").default;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
async function gettoken() {
  var options = {
    method: "POST",
    url: "https://securetoken.googleapis.com/v1/token",
    params: {
      key: "AIzaSyCQ8QlvMtQvpnj_7sfEIE8-YorcFOGlHCo",
      grant_type: "refresh_token",
      refresh_token:
        "AMf-vBwkUOqUe0rmaRPc9MEPPobWUPTeUNtILKZVdtzpu7-fAPmL8SUbJGRaN7LcRdZ5dAa7Hcrs7cbo2jaeaaz_EFQVs3DYAAVpPEAcTF5Yj9gUCmbMJnWyrHiJU74VRkRrUyifjj42lUgAllKt2IVYyMyF4uFOgS3Jf9AkQAOwhIUE4obIAJhjZN6wb_g35Xeu37HesqDYhRzjVbldSe6DDUZN8Xj512E6aAxoe8_RIW4h6kRIvWS1JURDrXRtIMi_iaoZzT--1jywgy6Sl_gtXYsjFXXngmxM1ajXLOfM3cuWe65NWPtubBCIMjhQU0NlFFWnfO5cpH2luEPItQ-S8LCw9tf6rhw1AEADVX2Ejgd_XXmogo9hHF45yceXtG_ByZ1r8rKFOL-kVMttXCn73L5nkmMDqZQIRgjxC5y1s_ifujVbNiA",
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": "insomnia/8.6.0",
      "X-Client-Data":
        "CIy2yQEIo7bJAQipncoBCJPuygEIk6HLAQic/swBCIWgzQEIou7NAQiD8M0BGMDLzAEYp+rNAQ==",
    },
  };
  const response = await axios(options);
  const data = response.data;
  const token = data.access_token;
  return token;
}
async function chat(q, token, res) {
  var options = {
    method: "POST",
    url: "https://www.hackergpt.chat/api/chat",
    params: { "": "" },
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "insomnia/8.6.0",
      Authorization: "Bearer " + token,
    },
    data: {
      model: "gpt-3.5-turbo-instruct",
      messages: [{ role: "user", content: q }],
      toolId: "enhancedsearch",
    },
  };

  axios
    .request(options)
    .then(function (response) {
      const data = response.data;
      res.status(200).json({ content: data });
    })
    .catch(function (error) {
      console.error(error);
    });
}

app.post("/ai/hackergpt", async (req, res) => {
  const { query } = req.body;

  if (!query) {
    res
      .status(400)
      .json({ error: "Invalid input. Both 'query' and 'role' are required." });
    return;
  }
  const t = await gettoken();
  chat(query, t, res);
});

app.listen(port, () => {
  console.log(`Your Server Running on ${port}`);
});
