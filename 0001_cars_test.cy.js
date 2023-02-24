import * as Common from "../../../../setup/common.js";

import cyInterfaceCARS from "./test_setup/cy_interface/interface.json";
import cyInterfaceChild from "./test_setup/cy_interface/interface_child.json";
import cyInterfaceADMIN from "./test_setup/cy_interface/admin_interface.json";
import example from "./test_example/example.json";
import path from "path";

Cypress.on("uncaught:exception", () => {
   // returning false here prevents Cypress from
   // failing the test
   return false;
});

// common setup
const cyInterfaceCommon = {
   button: {
      menu: '[data-cy="portal_work_menu_sidebar"]',
      user: '[data-cy="user_icon"]',
   },
   option: {
      user: {
         logout: '[data-cy="user_logout"]',
      },
   },
};

const folderName = __dirname.match(/[^\\/]+$/);

const importModule = () => {
   cy.request("POST", "/test/import", {
      file: `imports/${folderName}/test_import/module.json`,
   });
};

const openCars = () => {
   cy.visit("/");
   cy.get(cyInterfaceCommon.button.menu).should("be.visible").click();
   cy.get(cyInterfaceCARS.navigator).should("be.visible").click();
};

const childVisit = () => {
   openCars();
   cy.get(cyInterfaceCARS.tab.socialWorker).should("be.visible").click();
   cy.get(cyInterfaceCARS.page.socialWorker.tab.children)
      .should("be.visible")
      .click();
   cy.get(
      cyInterfaceCARS.page.socialWorker.page.children.view.child.position
   ).click({ force: true });
};

const homeAdministrationVisit = () => {
   openCars();
   cy.get(cyInterfaceCARS.tab.administration).should("be.visible").click();
   cy.get(cyInterfaceCARS.page.administration.tab.home)
      .should("be.visible")
      .click();
   cy.get(cyInterfaceCARS.page.administration.page.home.view.home.button).click(
      {
         force: true,
      }
   );
};

const navToNote = () => {
   childVisit();
   cy.get(
      cyInterfaceCARS.page.socialWorker.page.children.view.child.tab.socialWork
   )
      .should("be.visible")
      .click();
   cy.get(
      cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork
         .tab.notes
   )
      .should("be.visible")
      .click();
};

// TODO check this
// var projectAdministrationVisit = (indexOfProject) => {
//    cy.get(cyInterfaceCommon.button.menu).click();
//    cy.get(cyInterfaceCARS.navigator).click();
//    cy.get(cyInterfaceCARS.tab.administration).click();
//    cy.get(cyInterfaceCARS.page.administration.tab.project).click(); // or gratipay?
//    cy.get(
//       cyInterfaceCARS.page.administration.page.project.view.project.container
//    )
//       .find(
//          cyInterfaceCARS.page.administration.page.project.view.project.index.replace(
//             "[index]",
//             (9 + indexOfProject).toString()
//          )
//       )
//       .invoke("attr", "class")
//       .then((data) => {
//          cy.get(
//             cyInterfaceCARS.page.administration.page.project.view.project.button.replace(
//                "[projectID]",
//                data.split(" ")[3].replace("ab-record-", "")
//             )
//          ).click({ force: true });
//       });
// };

before(() => {
   Common.ResetDB(cy);
   Common.AuthLogin(cy);
   importModule();
});

beforeEach(() => {
   Common.AuthLogin(cy);
   Common.RunSQL(cy, folderName, ["reset_db.sql"]);
});

// End to End Testing
describe("Test Child:", () => {
   const childrenIndex = 0;
   const child = example.children[childrenIndex];
   it.only("Test Adding New Child", () => {
      //arrange
      const photoPath = path.join(
         "..",
         "e2e",
         `${folderName}`,
         "test_example",
         "images",
         child.profilePhoto
      );
      const fileExtension = child.profilePhoto.match(/(.+)\.(.+)$/)[2];

      //act
      Common.RunSQL(cy, folderName, ["init_db_for_adding_new_child.sql"]);
      openCars();
      cy.get(cyInterfaceCARS.tab.socialWorker).click();
      cy.get(cyInterfaceCARS.page.socialWorker.tab.children).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.button.addChildren
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .no
      )
         .should("be.visible")
         .click()
         .type(child.no);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .firstName
      ).type(child.firstName);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .lastName
      ).type(child.lastName);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .nickname
      ).type(child.nickname);

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .profilePhoto
      )
         .invoke("attr", "data-uploader-id")
         .then((uploader) => {
            cy.fixture(photoPath).then((data) => {
               const blob = Cypress.Blob.base64StringToBlob(
                  data,
                  `image/${fileExtension}`
               );
               const file = new File([blob], photoPath, {
                  type: `image/${fileExtension}`,
               });
               cy.window().then((win) => {
                  return win
                     .$$(uploader)
                     .addFile(file, file.size, fileExtension);
               });
            });
         });

      // cy.wait(500);

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .birthday
      ).type(child.birthday);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .birthday
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .gender
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.option
            .gender[0]
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .religion
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.option
            .religion[3]
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .race
      ).type(child.race);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .nationality
      ).type(child.nationality);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .home
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.option
            .home[0]
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .typeReceived
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.option
            .typeReceived[0]
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .timeReceivedfor
      ).type(child.timeReceivedfor);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .relatives
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.option
            .relatives[0]
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .relatives
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .carsProject
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.option
            .project[0]
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.button
            .save
      ).click();

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.children.container
      ).should("not.be.empty");

      //assert
      //assert in the Children container
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.children.container
      ).should((data) => {
         expect(
            data.text().includes(`Registration number (TH): ${child.no}`)
               ? child.no
               : "",
            "Registration number"
         ).to.eq(child.no);
         expect(
            data.text().includes(`${child.firstName}`) ? child.firstName : "",
            "First Name"
         ).to.eq(child.firstName);
         expect(
            data.text().includes(`${child.lastName}`) ? child.lastName : "",
            "Last Name"
         ).to.eq(child.lastName);
         expect(
            data.text().includes(`(${child.nickname})`) ? child.nickname : "",
            "Nickname"
         ).to.eq(child.nickname);
         expect(
            data.text().includes(`${child.home}`) ? child.home : "",
            "Home"
         ).to.eq(child.home);
         expect(
            data.text().includes(`${child.birthday}`) ? child.birthday : "",
            "Birthday"
         ).to.eq(child.birthday);
      });
      // TODO assert that:
      // perhaps these can be checked in the sql?
      // admit info generated
      // prelim health exam generated
      // physcial details generated
      // vaccination generated (and connected)
      // growth log generated (and connected)
      // asset log generated (and connected)
   });

   it("Test Adding Child on top of existing", () => {
      //
      // When staff wanted to add new orphan;
      // After they clicked save, the new data replaced the recent data.
      //
      //act
      Common.RunSQL(cy, folderName, [
         "init_db_for_viewing_a_child_profile.sql",
      ]);

      childVisit();

      // point the cursor at the existing child: this should be cleared later
      cy.get(
         '[data-cy^="menu-item Social Worker 5fea4e7b-f6ee-42da-a702-60d6d6c48f71"]'
      ).click();

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.button.addChildren
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .no
      )
         .should("be.visible")
         .click()
         .type("1337");
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .firstName
      ).type("Bob");
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .lastName
      ).type("Stone");
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .nickname
      ).type("Hank Hill");

      // cy.wait(500);

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .birthday
      ).type(child.birthday);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .birthday
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .gender
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .home
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.option
            .home[0]
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field
            .carsProject
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.option
            .project[0]
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.button
            .save
      ).click();

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.button
            .save
      ).should("not.be.visible");

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.children.container
      )
         .should("be.visible")
         .should("not.be.empty");

      // we have to wait a little for the front end to update
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.children.container
      ).should((data) => {
         expect(
            data.text().includes(`Registration number (TH): 1337`) ? 1337 : "",
            "Registration number"
         ).to.eq(1337);
         expect(data.text().includes(`Bob`) ? "Bob" : "", "First Name").to.eq(
            "Bob"
         );
         expect(
            data.text().includes(`Stone`) ? "Stone" : "",
            "Last Name"
         ).to.eq("Stone");
      });

      // is it still here on refresh?
      openCars();
      cy.get('[data-cy^="dataview container Children"]')
         .contains(child.firstName)
         .contains(child.lastName);
      cy.get('[data-cy^="dataview container Children"]')
         .contains("Bob")
         .contains("Stone");
   });

   it("Test Viewing A Child's Profile", () => {
      // act
      Common.RunSQL(cy, folderName, [
         "init_db_for_viewing_a_child_profile.sql",
      ]);

      // prepare for assertion
      childVisit();
      // cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.tab.basicInfo).click();
      // cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.basicInfo.tab.basicInfo).click();

      // assert
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.field.timeReceivedfor
      )
         .find(".ab-detail-component-holder")
         .should("be.visible");
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.field.timeReceivedfor
      )
         .find(".ab-detail-component-holder")
         .should((data) => {
            expect(data).not.to.be.empty;
         });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.field.timeReceivedfor
      ).should((data) => {
         expect(
            data.text().includes(child.timeReceivedfor)
               ? child.timeReceivedfor
               : "",
            "Time Recieved for"
         ).to.eq(child.timeReceivedfor);
      });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.field.firstName
      ).should((data) => {
         expect(
            data.text().includes(child.firstName) ? child.firstName : "",
            "First Name"
         ).to.eq(child.firstName);
      });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.field.lastName
      ).should((data) => {
         expect(
            data.text().includes(child.lastName) ? child.lastName : "",
            "Last Name"
         ).to.eq(child.lastName);
      });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.field.nickname
      ).should((data) => {
         expect(
            data.text().includes(child.nickname) ? child.nickname : "",
            "Nickname"
         ).to.eq(child.nickname);
      });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.field.race
      ).should((data) => {
         expect(
            data.text().includes(child.race) ? child.race : "",
            "Race"
         ).to.eq(child.race);
      });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.field.nationality
      ).should((data) => {
         expect(
            data.text().includes(child.nationality) ? child.nationality : "",
            "Nationality"
         ).to.eq(child.nationality);
      });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.field.birthday
      ).should((data) => {
         expect(
            data.text().includes(child.birthday) ? child.birthday : "",
            "Birthday"
         ).to.eq(child.birthday);
      });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.field.religion
      ).should((data) => {
         expect(
            data.text().includes(child.religion) ? child.religion : "",
            "Religion"
         ).to.eq(child.religion);
      });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.field.home
      ).should((data) => {
         expect(
            data.text().includes(child.home) ? child.home : "",
            "Home"
         ).to.eq(child.home);
      });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.field.gender
      ).should((data) => {
         expect(
            data.text().includes(child.gender) ? child.gender : "",
            "Gender"
         ).to.eq(child.gender);
      });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.field.typeReceived
      ).should((data) => {
         expect(
            data.text().includes(child.typeReceived) ? child.typeReceived : "",
            "Type Recieived"
         ).to.eq(child.typeReceived);
      });
   });

   it("Test editing a child", () => {
      //act
      Common.RunSQL(cy, folderName, ["init_db_for_editing_a_child.sql"]);
      childVisit(childrenIndex);
      // cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.tab.basicInfo).click();
      // cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.basicInfo.tab.basicInfo).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.button.editBasicInfo
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.form.editBasicInfo.field.idIssueDate
      )
         .should("be.visible")
         .type(child.idIssueDate);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.form.editBasicInfo.field.idIssueDate
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.form.editBasicInfo.field.carsProject
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.form.editBasicInfo.option.carsProject[0]
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.form.editBasicInfo.field.idExpireDate
      ).type(child.idExpireDate);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.form.editBasicInfo.field.idExpireDate
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.form.editBasicInfo.field.idNumber
      ).type(child.idNumber);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.form.editBasicInfo.field.address
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.form.editBasicInfo.option.address[0]
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.form.editBasicInfo.field.address
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.form.editBasicInfo.button.save
      ).click();

      // test the report update
      cy.get(cyInterfaceChild.page.basicInfo.tab.admitInfo).click();
      cy.get(
         cyInterfaceChild.page.basicInfo.page.admitInfo.button.editAdmitInfo
      ).should("be.visible");
      cy.get(
         cyInterfaceChild.page.basicInfo.page.admitInfo.button.fillReportData
      ).click(); // is invisible in tiny window
      cy.get('[data-cy^="string Reason Received 62a95880"]')
         .should("be.visible")
         .type("a")
         .clear()
         .type("test");
      cy.get('[data-cy^="connectObject Child"]').should("be.visible").click();
      cy.get(
         '[data-cy="connectObject options 0e41a300-4698-40c8-9c5f-f96ea2ceadf6 9db31333-1cbf-429e-b3f7-46573a274054 5027cd9a-ee6d-4505-bdbd-8e7432ebeafc"]'
      )
         .contains("SatoshiNakamoto")
         .click();
      cy.get('[data-cy^="button save"]')
         .contains("Save Admission Info")
         .scrollIntoView()
         .click({ force: true });

      cy.get(".webix_spin").should("not.be.visible");

      cy.get(".webix_button")
         .contains("New data available. Click to reload.")
         .click({ multiple: true }); //Pop-up not close
      //("[data-cy=\"\"]")
      // prelim health exam
      childVisit();
      cy.get(cyInterfaceChild.tab.medical).click({ force: true });
      cy.get(
         cyInterfaceChild.page.medical.page.prelimHealthExam.button.edit
      ).click();
      cy.get(
         cyInterfaceChild.page.medical.page.prelimHealthExam.form.edit.fields
            .children
      ).click();
      cy.get(
         cyInterfaceChild.page.medical.page.prelimHealthExam.form.edit.option
            .children[0]
      ).click();
      cy.get(
         cyInterfaceChild.page.medical.page.prelimHealthExam.form.edit.fields
            .otherDetails
      )
         .scrollIntoView()
         .type("a")
         .clear()
         .type("healthTest");
      cy.get(
         cyInterfaceChild.page.medical.page.prelimHealthExam.form.edit.button
            .save
      ).click();
      cy.get(
         cyInterfaceChild.page.medical.page.prelimHealthExam.button.edit
      ).click();
      cy.get(
         cyInterfaceChild.page.medical.page.prelimHealthExam.form.edit.fields
            .otherDetails
      )
         .scrollIntoView()
         .should("contain", "healthTest");
      cy.get(
         '[data-cy="menu-item Prelim Health Exam d0e4162b-fd98-41aa-9ef4-a409f10e14e4 00c4e9d1-aded-455f-a0ec-56dec6f048e2"]'
      ).click();
      cy.get(cyInterfaceChild.page.medical.tab.healthInfo).click();
      cy.get(cyInterfaceChild.page.medical.page.healthInfo.button.add).click();
      cy.get(
         cyInterfaceChild.page.medical.page.healthInfo.form.add.fields
            .injections
      ).type("completed");
      cy.get(cyInterfaceChild.page.medical.page.healthInfo.form.add.button.save)
         .scrollIntoView()
         .click();
      cy.get(".webix_spin").should("not.be.visible");
      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .contains("New data available. Click to reload.")
         .click({ multiple: true, force: true });
      cy.get(".webix_spin").should("not.be.visible");

      // cy.get('[data-cy^="string Reason Received"]')
      //    .scrollIntoView()
      //    .contains("test");
      // .should("contain", "test");
      // prepare for assertion
      // TODO: shouldn't need to reload.
      childVisit();

      //assert
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.field.idExpireDate
      ).should((data) => {
         expect(
            data.text().includes(child.idExpireDate) ? child.idExpireDate : "",
            "ID Expire Date"
         ).to.eq(child.idExpireDate);
      });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.field.idNumber
      ).should((data) => {
         expect(
            data.text().includes(child.idNumber) ? child.idNumber : "",
            "ID Number"
         ).to.eq(child.idNumber);
      });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.field.address
      ).should((data) => {
         expect(
            data.text().includes(child.address.addressNo)
               ? child.address.addressNo
               : "",
            "Address No"
         ).to.eq(child.address.addressNo);
         expect(
            data.text().includes(` ${child.address.moo} `)
               ? child.address.moo
               : "",
            "Moo"
         ).to.eq(child.address.moo);
         expect(
            data.text().includes(child.address.district)
               ? child.address.district
               : "",
            "District"
         ).to.eq(child.address.district);
         expect(
            data.text().includes(child.address.city) ? child.address.city : "",
            "City"
         ).to.eq(child.address.city);
         expect(
            data.text().includes(child.address.province)
               ? child.address.province
               : "",
            "Province"
         ).to.eq(child.address.province);
         expect(
            data.text().includes(child.address.postalCode)
               ? child.address.postalCode
               : "",
            "Postal Code"
         ).to.eq(child.address.postalCode);
      });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.field.idIssueDate
      ).should((data) => {
         expect(
            data.text().includes(child.idIssueDate) ? child.idIssueDate : "",
            "ID Issue Date"
         ).to.eq(child.idIssueDate);
      });
   });
});

describe("Test Report:", () => {
   it("Export basic report", () => {
      //act
      Common.RunSQL(cy, folderName, ["init_db_default.sql"]);
      childVisit();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.button.reports
      ).click();

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.page.reports.button.downloads.one
      ).find(".fa-file-word-o");
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.page.reports.button.downloads.one
      ).click({ force: true });

      // prepare for assertion

      // assert
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .basicInfo.page.basicInfo.page.reports.button.downloads.one
      ).then((data) => {
         // cy.exec(`ls ${path.join("cypress", "downloads")}`).should((files) => {
         //    cy.log(files);
         //    if (files) {
         //       var downloadFiles = files.stdout
         //          .split("\n")
         //          .map((e, i) => e.match(/(.+)\..+$/)[1]);
         //       cy.log(downloadFiles);
         //       expect(downloadFiles, "File Downloads").to.include(data.text());
         //    }
         // });
         // file path is relative to the working folder
         const filename = path.join(
            Cypress.config("downloadsFolder"),
            data.text() + ".docx"
         );

         // browser might take a while to download the file,
         // so use "cy.readFile" to retry until the file exists
         // and has length - and we assume that it has finished downloading then
         cy.readFile(filename).should("have.length.gt", 500);
      });
   });
});

describe("Test Home:", () => {
   const homesIndex = 0;
   const home = example.homes[homesIndex];
   it("Test Add New Home", () => {
      // act
      Common.RunSQL(cy, folderName, ["init_db_for_adding_new_home.sql"]);
      openCars();
      cy.get(cyInterfaceCARS.page.socialWorker.tab.home).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.home.button.addChildrenHome
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.home.form.addChildrenHome.field
            .homeName
      ).type(home.homeName);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.home.form.addChildrenHome.field
            .director
      ).type(home.director);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.home.form.addChildrenHome.field
            .socialWorker
      ).type(home.socialWorker);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.home.form.addChildrenHome.field
            .staff
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.home.form.addChildrenHome.option
            .staff[0]
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.home.form.addChildrenHome.field
            .staff
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.home.form.addChildrenHome.field
            .address
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.home.form.addChildrenHome.option
            .address[0]
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.home.form.addChildrenHome.field
            .carsProject
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.home.form.addChildrenHome.option
            .carsProject[0]
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.home.form.addChildrenHome.button
            .save
      ).click();

      cy.get(cyInterfaceCARS.page.socialWorker.tab.children).click();
      cy.get(cyInterfaceCARS.page.socialWorker.tab.home).click();
      // assert
      // assert in the Home container
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.home.view.homes.container
      ).should((data) => {
         expect(
            data.text().includes(home.homeName) ? home.homeName : "",
            "Home Name"
         ).to.eq(home.homeName);
         expect(
            data.text().includes(home.director) ? home.director : "",
            "Director"
         ).to.eq(home.director);
         expect(
            data.text().includes(home.socialWorker) ? home.socialWorker : "",
            "Social Worker"
         ).to.eq(home.socialWorker);
      });

      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_6aac7a56-c849-4833-bc7d-85dbadf649be_datatable")
            .scrollTo(400, 1);
      });

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.home.view.homes.container
      ).should((data) => {
         expect(
            data.text().includes(home.address.addressNo)
               ? home.address.addressNo
               : "",
            "Address No"
         ).to.eq(home.address.addressNo);
         expect(
            data.text().includes(home.address.addressNo)
               ? home.address.moo
               : "",
            "Moo"
         ).to.eq(home.address.moo);
         expect(
            data.text().includes(home.address.district)
               ? home.address.district
               : "",
            "District"
         ).to.eq(home.address.district);
         expect(
            data.text().includes(home.address.city) ? home.address.city : "",
            "City"
         ).to.eq(home.address.city);
         expect(
            data.text().includes(home.address.province)
               ? home.address.province
               : "",
            "Province"
         ).to.eq(home.address.province);
         expect(
            data.text().includes(home.address.postalCode)
               ? home.address.postalCode
               : "",
            "Postal Code"
         ).to.eq(home.address.postalCode);
         expect(
            data.text().includes(home.staff) ? home.staff : "",
            "Staff"
         ).to.eq(home.staff);
      });

      cy.window()
         .then((win) => {
            console.log(win);
            return win
               .$$(
                  cyInterfaceCARS.page.socialWorker.page.home.view.homes
                     .viewGrid
               )
               .scrollTo(10000, 0);
         })
         .then(() => {
            cy.get(
               cyInterfaceCARS.page.socialWorker.page.home.view.homes.container
            ).should((data) => {
               expect(
                  data.text().includes(home.carsProject.name)
                     ? home.carsProject.name
                     : "",
                  "CARS Project"
               ).to.eq(home.carsProject.name);
            });
         });
   });

   it("Test Update existing Home", () => {
      // act
      Common.RunSQL(cy, folderName, ["init_db_for_updating_existing_home.sql"]);
      homeAdministrationVisit(homesIndex);
      cy.get(
         cyInterfaceCARS.page.administration.page.home.view.home.form.field
            .phoneNumber
      ).type(home.phoneNumber);
      cy.get(
         cyInterfaceCARS.page.administration.page.home.view.home.form.button
            .save
      ).click();

      // prepare for assertion
      cy.get(cyInterfaceCARS.tab.socialWorker).click();
      cy.get(cyInterfaceCARS.page.socialWorker.tab.home).click();

      // assert
      cy.window()
         .then((win) => {
            console.log(win);
            return win
               .$$(
                  cyInterfaceCARS.page.socialWorker.page.home.view.homes
                     .viewGrid
               )
               .scrollTo(10000, 0);
         })
         .then(() => {
            cy.get(
               cyInterfaceCARS.page.socialWorker.page.home.view.homes.container
            ).should((data) => {
               expect(
                  data.text().includes(home.phoneNumber)
                     ? home.phoneNumber
                     : "",
                  "Phone Number"
               ).to.eq(home.phoneNumber);
            });
         });
   });
});

describe("Test Project:", () => {
   const projectIndex = 0;
   const project = example.projects[projectIndex];
   it("Test Add New Project", () => {
      // act
      Common.RunSQL(cy, folderName, ["init_db_for_adding_new_project.sql"]);
      openCars();

      cy.get(cyInterfaceCARS.tab.administration).click();
      cy.get(cyInterfaceCARS.page.administration.tab.project).click();
      cy.get(
         cyInterfaceCARS.page.administration.page.project.button.addProject
      ).click();
      cy.get(
         cyInterfaceCARS.page.administration.page.project.form.addProject.field
            .name
      )
         .should("be.visible")
         .type("Please work")
         .clear()
         .type(project.projectName);
      cy.get(
         cyInterfaceCARS.page.administration.page.project.form.addProject.field
            .projectHome
      ).click();
      cy.get(
         cyInterfaceCARS.page.administration.page.project.form.addProject.option
            .projectHome[0]
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.administration.page.project.form.addProject.field
            .projectHome
      ).click();
      cy.get(
         cyInterfaceCARS.page.administration.page.project.form.addProject.button
            .save
      ).click();

      cy.get(cyInterfaceCARS.page.administration.tab.home).click();
      cy.get(cyInterfaceCARS.page.administration.tab.project).click();

      // assert
      // assert in the Home container
      cy.get(
         cyInterfaceCARS.page.administration.page.project.view.projects.detail
            .projectName
      )
         .find(".ab-detail-component-holder") // ab-detail-component-holder
         .should((data) => {
            expect(
               data.text().includes(project.projectName)
                  ? project.projectName
                  : "",
               "Project Name"
            ).to.eq(project.projectName);
         })
         .get(
            cyInterfaceCARS.page.administration.page.project.view.projects
               .detail.homeName
         )
         .find(".webix_multicombo_value")
         .should((data) => {
            expect(
               data.text().includes(project.carsHomes) ? project.carsHomes : "",
               "Home"
            ).to.eq(project.carsHomes);
         });
   });

   it("Test Update existing Project", () => {
      // act
      Common.RunSQL(cy, folderName, [
         "init_db_for_updating_existing_project.sql",
      ]);
      openCars();
      cy.get(cyInterfaceCARS.tab.administration).click();
      cy.get(cyInterfaceCARS.page.administration.tab.project).click();
      cy.get(
         cyInterfaceCARS.page.administration.page.project.view.projects.detail
            .projectName
      ).invoke("mouseover");
      cy.get(
         cyInterfaceCARS.page.administration.page.project.button.editProject
      ).click({ force: true });
      cy.get(
         cyInterfaceCARS.page.administration.page.project.form.editProject.field
            .name
      ).type("337");
      cy.get(
         cyInterfaceCARS.page.administration.page.project.form.editProject.field
            .projectHome
      ).click();
      cy.get(
         cyInterfaceCARS.page.administration.page.project.form.editProject
            .option.projectHome[0]
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.administration.page.project.form.editProject.field
            .projectHome
      ).click();
      cy.get(
         cyInterfaceCARS.page.administration.page.project.form.editProject.field
            .projectStaff
      ).click();
      cy.get(
         cyInterfaceCARS.page.administration.page.project.form.editProject
            .option.projectStaff[0]
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.administration.page.project.form.editProject.field
            .projectStaff
      ).click();
      cy.get(
         cyInterfaceCARS.page.administration.page.project.form.editProject
            .button.save
      ).click();

      //prepare for assertion
      cy.get(cyInterfaceCARS.page.administration.tab.home).click();
      cy.get(cyInterfaceCARS.page.administration.tab.project).click();

      // assert
      // assert in the Home container
      cy.get(
         cyInterfaceCARS.page.administration.page.project.view.projects.project
      ).contains(project.projectName + "337");
   });
});

describe("Test Staff:", () => {
   it.skip("Test Add New Staff", () => {
      // arrange
      var staff = example.staff[1];

      Common.RunSQL(cy, folderName, ["init_db_for_adding_new_staff.sql"]);

      // Create in CARs
      openCars();

      cy.get(cyInterfaceCARS.tab.administration).click();
      cy.get(cyInterfaceCARS.page.administration.tab.staff).click();
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.button.addStaff
      ).click();
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.addStaff.field
            .position
      )
         .should("be.visible")
         .type("Please work")
         .clear()
         .type(staff.position);
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.addStaff.field
            .firstName
      ).type(staff.firstName);
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.addStaff.field
            .lastName
      ).type(staff.lastName);
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.addStaff.field
            .phone
      ).type(staff.phone);

      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.addStaff.field.home
      ).click();

      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.addStaff.option
            .home[0]
      )
         .should("be.visible")
         .click();

      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.addStaff.field.home
      ).click();

      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.addStaff.field
            .staffUser
      ).click();
      // // this should work:
      // cy.get(cyInterfaceCARS.page.administration.page.staff.form.addStaff.option.staffUser[1]).click().wait(250);
      // option 2
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.addStaff.option
            .staffUser[1]
      )
         .should("be.visible")
         .click();

      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.addStaff.button
            .save
      ).click();

      // cy.get(cyInterfaceCARS.page.administration.tab.home).click().wait(700);
      // cy.get(cyInterfaceCARS.page.administration.tab.staff).click().wait(2500);

      // assert
      // assert in the Home container
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.view.staff.detail
            .firstName
      )
         .should((data) => {
            expect(
               data.text().includes(staff.firstName) ? staff.firstName : "",
               "First Name"
            ).to.eq(staff.firstName);
         })
         .get(
            cyInterfaceCARS.page.administration.page.staff.view.staff.detail
               .lastName
         )
         .should((data) => {
            expect(
               data.text().includes(staff.lastName) ? staff.lastName : "",
               "Last Name"
            ).to.eq(staff.lastName);
         });
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.view.staff.detail
            .position
      ).should((data) => {
         expect(
            data.text().includes(staff.position) ? staff.position : "",
            "Worker"
         ).to.eq(staff.position);
      });
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.view.staff.detail.user
      ).should((data) => {
         expect(
            data.text().includes(staff.staffUser) ? staff.staffUser : "",
            "User"
         ).to.contain(staff.staffUser);
         // a800412a-ff61-4dad-aba5-7163b80ffa25
         //detail text Staff User 5cfb8cb4-26db-4204-a4d0-7c822eda4291 513d727e-e395-4f46-b9a0-31f3a687a336
      });
   });

   it.skip("Test Update existing Staff", () => {
      // arrange
      var staff = example.staff[1];

      // act
      Common.RunSQL(cy, folderName, [
         "init_db_for_updating_existing_staff.sql",
      ]);
      openCars();

      cy.get(cyInterfaceCARS.tab.administration).click();
      cy.get(cyInterfaceCARS.page.administration.tab.staff).click();
      // this randomly fails
      //cy.get(cyInterfaceCARS.page.administration.page.staff.view.staff.container).trigger('mouseover').wait(500);
      cy.get(cyInterfaceCARS.page.administration.page.staff.button.editStaff)
         .invoke("show")
         .click({ force: true });
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.field
            .position
      ).clear();
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.field
            .position
      ).type(staff.position);
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.field
            .firstName
      ).clear();
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.field
            .firstName
      ).type(staff.firstName);
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.field
            .lastName
      ).clear();
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.field
            .lastName
      ).type(staff.lastName);
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.field
            .phone
      ).clear();
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.field
            .phone
      ).type(staff.phone);

      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.field
            .home
      ).click();
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.option
            .home[0]
      )
         .should("be.visible")
         .click();

      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.field
            .staffUser
      ).click();

      //// TODO this selector isn't working???
      //cy.get(cyInterfaceCARS.page.administration.page.staff.form.editStaff.option.staffUser[0]).click();

      // //cy.get(cyInterfaceCARS.page.administration.page.staff.button.editStaff)
      // cy.get(".webix_view webix_window webix_popup")
      //   .find(".webix_list_item ")
      //   .should((data) =>{
      //     cy.log(data)
      //     // expect(data.text().includes(staff.position) ? staff.position: "", "Worker").to.eq(staff.position);
      //   })

      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.option
            .staffUser[1]
      ).click();

      //cy.get(cyInterfaceCARS.page.administration.page.staff.form.editStaff.option.staffUser).click();
      //.find(".webix_list_item")

      //cy.get(cyInterfaceCARS.page.administration.page.staff.form.editStaff.option.staffUser).click().wait(50);

      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.button
            .save
      ).click();

      // cy.get(cyInterfaceCARS.page.administration.tab.home).click().wait(700);
      // cy.get(cyInterfaceCARS.page.administration.tab.staff).click().wait(700);

      // assert
      // assert in the Home container
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.view.staff.detail
            .firstName
      ).should((data) => {
         expect(
            data.text().includes(staff.firstName) ? staff.firstName : "",
            "First Name"
         ).to.eq(staff.firstName);
      });
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.view.staff.detail
            .position
      ).should((data) => {
         expect(
            data.text().includes(staff.position) ? staff.position : "",
            "Worker"
         ).to.eq(staff.position);
      });
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.view.staff.detail
            .lastName
      ).should((data) => {
         expect(
            data.text().includes(staff.lastName) ? staff.lastName : "",
            "Last Name"
         ).to.eq(staff.lastName);
      });
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.view.staff.detail.user
      ).should((data) => {
         expect(
            data.text().includes(staff.staffUser) ? staff.staffUser : "",
            "Username"
         ).to.contain(staff.staffUser);
      });
   });
   it("Test Remove existing Staff", () => {
      // arrange
      var staff = example.staff[2];

      // act
      Common.RunSQL(cy, folderName, [
         "init_db_for_removing_existing_staff.sql",
      ]);
      cy.visit("/");

      // CREATE USER
      // TODO move to admin tests area?
      cy.get(cyInterfaceCommon.button.menu).click();
      cy.get(cyInterfaceADMIN.tab.administration).click();
      cy.get(cyInterfaceADMIN.tab.users).click();
      cy.get(cyInterfaceADMIN.page.users.page.grid)
         .filter(":visible")
         // cy.get(cyInterfaceADMIN.page.users.page.grid)
         .contains(staff.staffUser)
         .should("be.visible")
         .click({ force: true });
      cy.get(cyInterfaceADMIN.page.users.page.form.editUser.field.isactive)
         .filter(":visible")
         .click();
      cy.get(cyInterfaceADMIN.page.users.page.form.editUser.button.save)
         .filter(":visible")
         .click();

      // Remove in CARs
      openCars();

      cy.get(cyInterfaceCARS.tab.administration).click();
      cy.get(cyInterfaceCARS.page.administration.tab.staff).click();

      cy.get(
         cyInterfaceCARS.page.administration.page.staff.button.editStaff
      ).click({ force: true }); // force needed because element only appears when hovered
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.field
            .position
      )
         .clear()
         .type("N/A");
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.field
            .home
      )
         .find(".webix_multicombo_delete")
         .click();

      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.field
            .staffUser
      ).click();

      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.option
            .staffUser[0]
      ).click();

      cy.get(
         cyInterfaceCARS.page.administration.page.staff.form.editStaff.button
            .save
      ).click();

      // try to reset the dataview
      // cy.get(cyInterfaceCARS.page.administration.tab.home).click().wait(700);
      // cy.get(cyInterfaceCARS.page.administration.tab.staff).click().wait(700);

      // assert
      // assert in the Home container
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.view.staff.detail
            .firstName
      ).should((data) => {
         expect(
            data.text().includes(staff.firstName) ? staff.firstName : "",
            "First Name"
         ).to.eq(staff.firstName);
      });
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.view.staff.detail
            .position
      ).should((data) => {
         expect(data.text().includes("N/A") ? "N/A" : "", "N/A").to.eq("N/A");
      });
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.view.staff.detail
            .lastName
      ).should((data) => {
         expect(
            data.text().includes(staff.lastName) ? staff.lastName : "",
            "Last Name"
         ).to.eq(staff.lastName);
      });
      cy.get(
         cyInterfaceCARS.page.administration.page.staff.view.staff.detail.user
      ).should((data) => {
         expect(
            data.text().includes("") ? "" : staff.staffUser,
            "Username"
         ).to.eq("");
      });
   });
});

// TODO Change to data-cy
describe("Test Report Manager:", () => {
   it("Test Add New Report", () => {
      //act
      Common.RunSQL(cy, folderName, [
         "init_db_for_viewing_a_child_profile.sql",
      ]);
      openCars();
      cy.get(cyInterfaceCARS.page.socialWorker.tab.reports).click();
      cy.get(cyInterfaceCARS.page.socialWorker.page.reports.button.new)
         .contains("New")
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.reports.form.new.field
            .reportName
      )
         .find("[type='text']")
         .should("be.visible")
         .clear()
         .type("Latest Report");
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.reports.form.new.field
            .description
      )
         .find("textarea")
         .should("be.visible")
         .clear()
         .type("Updated Data");
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.reports.form.new.field
            .dataSource
      )
         .scrollIntoView()
         .find(".wxi-menu-down")
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.reports.form.new.option
            .dataSource[0]
      )
         .scrollIntoView()
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.reports.form.new.button.save
      )
         .contains("Save")
         .should("exist")
         .click();
      cy.get(cyInterfaceCARS.page.socialWorker.page.reports.button.allReports)
         .contains("All reports")
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.reports.form.new.field.reports
      )
         .should("be.visible")
         .contains("Latest Report")
         .scrollIntoView()
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.reports.view.reports.viewGrid
      )
         .find(".webix_ss_center")
         .should("be.visible")
         .contains("Nakamoto");
   });
});

describe("Test Social Worker Note:", () => {
   const note = example.note[0];
   it("Test Edit Note", () => {
      //act
      Common.RunSQL(cy, folderName, ["init_db_for_updating_existing_note.sql"]);
      navToNote();

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      ).find(".webix_cell");

      cy.window().then((win) => {
         return win
            .$$(
               cyInterfaceCARS.page.socialWorker.page.children.view.child.page
                  .socialWork.page.notes.viewGrid
            )
            .scrollTo(10000, 0);
      });

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      )
         .find(".edit")
         .should("be.visible")
         .click({ force: true });

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.field.title
      ).should("be.visible");

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.field.title
      ).clear();

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.field.title
      )
         .click()
         .type(note.title);

      // Date
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.field.date
      ).click();
      cy.get(".webix_cal_icon_clear").click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.field.date
      ).type(note.date);
      // cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.editNote.field.date).click();
      // cy.get(".webix_cal_icon_today").click()

      // TODO this has no data-cy
      //cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.editNote.field.text).clear().type(note.text);

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.field.file
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.option.file[0]
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.field.file
      ).click();

      //save
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.button.save
      ).click();

      // prepare for assertion
      // click reload data button
      // TODO replace with data-cy
      //cy.find('.webix_view webix_control webix_el_button webix_primary webix_warn').click();

      cy.window().then((win) => {
         return win
            .$$(
               cyInterfaceCARS.page.socialWorker.page.children.view.child.page
                  .socialWork.page.notes.viewGrid
            )
            .scrollTo(0, 0);
      });

      // cy.get(
      //    cyInterfaceCARS.page.socialWorker.page.children.view.child.page
      //       .socialWork.page.notes.grid
      // )
      //    .find(".webix_vscroll_x")
      //    .scrollTo("left");

      //assert
      // cy.get(
      //    cyInterfaceCARS.page.socialWorker.page.children.view.child.page
      //       .socialWork.page.notes.grid
      // )
      //    .find(
      //       cyInterfaceCARS.page.socialWorker.page.children.view.child.page
      //          .socialWork.page.notes.columns[0]
      //    )
      //    .find(".webix_row_select")
      //    .should((data) => {
      //       cy.log(data);
      //    });

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      ).contains(note.title);

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      ).contains(note.date);
      // .get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.grid)
      // .find(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.columns[2])
      // .find(".webix_row_select")
      // .should((data) => {
      //   expect(data.text().includes(note.text) ? note.text: "", "text").to.eq(note.text);
      // })
      // .get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.grid)
      // .find(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.columns[3])
      // .find(".webix_row_select")
      // .should((data) => {
      //   expect(data.text().includes(note.category) ? note.category: "", "category").to.eq(note.category);
      // })
      // 4 is the child
      cy.window().then((win) => {
         return win
            .$$(
               cyInterfaceCARS.page.socialWorker.page.children.view.child.page
                  .socialWork.page.notes.viewGrid
            )
            .scrollTo(10000, 0);
      });

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      ).contains(note.fileName);
   });

   it("Test Add New Note", () => {
      // TODO act
      //act
      Common.RunSQL(cy, folderName, ["init_db_for_adding_new_note.sql"]);
      navToNote();

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.button.addNote
      ).click();

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.field.title
      )
         .should("be.visible")
         .click()
         .type("Please work")
         .clear()
         .type(note.title);

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.field.date
      ).click();
      cy.get(".webix_cal_icon_clear").click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.field.date
      ).type(note.date);

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.field.categories
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.option.categories[0]
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.field.categories
      ).click();
      //save
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.button.save
      ).click();

      // prepare for assertion
      // click reload data button
      // TODO replace with data-cy
      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .click({ multiple: true, force: true });

      //assert
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      ).find(".webix_cell");

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      ).contains(note.date);

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      ).contains(note.title);
   });
});
