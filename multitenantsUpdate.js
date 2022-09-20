const axios = require("axios");

const [, , tenantAdminURL, tenantAdminUserToken] = process.argv;

(async () => {
   console.log();
   console.log("Multi-Tenant Update - Start!");
   console.log();

   const headers = {
      "tenant-token": "admin",
      "user-token": `${tenantAdminUserToken}`,
   };
   const url = `https://${tenantAdminURL}/definition/tenants-update-application`;
   const data = require("./test_import/module.json");
   const application = data.definitions.find((e) => {
      return e.type === "application";
   });
   const date = new Date();
   const fileString = JSON.stringify(data);
   const templateDataLength = 10000;
   const template = {
      applicationUUID: application.id,
      state: 0,
      date,
   };

   try {
      console.log("Multi-Tenant Update - Tranfering... the definition.");
      console.log();

      await axios({
         method: "post",
         headers,
         url,
         data: template,
      });

      template.state = 1;

      const writeLoops = Math.ceil(fileString.length / templateDataLength);

      for (let i = 0; i < writeLoops; i++) {
         template.data = fileString.slice(
            i * templateDataLength,
            (i + 1) * templateDataLength < fileString.length
               ? (i + 1) * templateDataLength
               : fileString.length
         );

         await axios({
            method: "post",
            headers,
            url,
            data: template,
         });

         console.log(
            `Multi-Tenant Update - Complete ...${(100 * (i + 1)) / writeLoops}%`
         );
      }
      console.log();

      template.state = 2;

      delete template.data;

      console.log(
         "Multi-Tenant Update - The server is importing... the definition!"
      );
      console.log();

      await axios({
         method: "post",
         headers,
         url,
         data: template,
      });

      console.log("Multi-Tenant Update - DONE!");
      console.log();
   } catch (error) {
      console.error("Multi-Tenant Update - Error!");
      console.error();
      console.error(error);
      console.error();
   }
})();
