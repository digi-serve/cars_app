import * as Common from "../../../../setup/common.js";

import cyInterfaceCARS from "./test_setup/cy_interface/interface.json";
import cyInterfaceCHILD from "./test_setup/cy_interface/interface_child.json";
// common setup
const cyInterfaceCommon = {
   button: {
      menu: '[data-cy="portal_work_menu_sidebar"]',
   },
};
const folderName = __dirname.match(/[^\\/]+$/);

const importModule = () => {
   cy.request("POST", "/test/import", {
      file: `imports/${folderName}/test_import/module.json`,
   });
};

Cypress.on("uncaught:exception", () => {
   // returning false here prevents Cypress from
   // failing the test
   return false;
});

// CARS setup

const childVisit = () => {
   cy.get(cyInterfaceCommon.button.menu).should("be.visible").click();
   cy.get(cyInterfaceCARS.navigator).should("be.visible").click();
   cy.get(cyInterfaceCARS.tab.socialWorker).should("be.visible").click();
   cy.get(cyInterfaceCARS.page.socialWorker.tab.children)
      .should("be.visible")
      .click();
   cy.get(
      cyInterfaceCARS.page.socialWorker.page.children.view.child.position
   ).click({ force: true });
   // cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.children.container)
   //     .find(cyInterfaceCARS.page.socialWorker.page.children.view.children.index.replace("[index]", (5 + indexOfChild).toString()))
   //     .invoke("attr", "class")
   //     .then((data) => {
   //         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.position.replace("[childID]", data.split(' ')[3].replace("ab-record-", ''))).click();
   //     });
};

// End to End Testing
describe("Test add-new forms:", () => {
   before(() => {
      Common.ResetDB(cy);
      Common.AuthLogin(cy);
      importModule();
      Common.AuthLogin(cy);
   });

   beforeEach(() => {
      Common.RunSQL(cy, folderName, ["reset_db.sql"]);
      Common.RunSQL(cy, folderName, ["init_db_for_updating_a_childs_data.sql"]);
      Common.AuthLogin(cy);
      cy.visit("/");
      childVisit();
   });

   const text = "Hello World";
   function save(parent, child, field) {
      cy.get(cyInterfaceCHILD.tab[parent]).should("be.visible").click();
      cy.get(cyInterfaceCHILD.page[parent].tab[child])
         .should("be.visible")
         .click();
      cy.get(cyInterfaceCHILD.page[parent].page[child].button.add)
         .should("be.visible")
         .click();
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.fields[field])
         .scrollIntoView()
         .should("exist")
         .type(text);
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.button.save)
         // .scrollIntoView()
         .should("exist")
         .click();
   }
   function saveAndCheck(parent, child, field) {
      cy.log(parent, child, field);
      save(parent, child, field);
      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .click({ force: true });
      cy.get(cyInterfaceCHILD.page[parent].page[child].grid)
         .contains(text)
         .log();
   }
   it("Test file", () => {
      //act
      cy.get(cyInterfaceCHILD.page.basicInfo.tab.files)
         .should("be.visible")
         .click();
      cy.get(cyInterfaceCHILD.page.basicInfo.page.files.button.addFile)
         .should("be.visible")
         .click();
      cy.get(cyInterfaceCHILD.page.basicInfo.page.files.form.label).type(text);
      //
      // TODO add file
      //
      cy.get(cyInterfaceCHILD.page.basicInfo.page.files.form.button.save)
         .should("exist")
         .click();

      cy.get(".webix_warn").find(".webix_button").should("be.visible").click();
      // should contain new data in grid
      cy.get(cyInterfaceCHILD.page.basicInfo.page.files.grid).contains(text);
   });

   // Education //
   it("Test educationInfo", () => {
      // Cannot click on already viewed child page
      let parent = "education";
      let child = "educationInfo";
      let field = "school";
      cy.log(parent, child, field);
      cy.get(cyInterfaceCHILD.tab[parent]).should("be.visible").click();
      //cy.get(cyInterfaceCHILD.page[parent].tab[child]).click().wait(200)
      cy.get(cyInterfaceCHILD.page[parent].page[child].button.add)
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCHILD.page[parent].page[child].form.add.fields[field]
      ).type(text);
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.button.save)
         .should("exist")
         .click();
      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .click({ force: true });
      cy.get(cyInterfaceCHILD.page[parent].page[child].grid)
         .contains(text)
         .log();
   });
   it("Test careerInfo", () => {
      // TODO grid is too small, needs to scroll
      //saveAndCheck("education","careerInfo","workPlace")
      let parent = "education";
      let child = "careerInfo";
      let field = "workPlace";
      cy.log(parent, child, field);
      cy.get(cyInterfaceCHILD.tab[parent]).should("be.visible").click();
      cy.get(cyInterfaceCHILD.page[parent].tab[child])
         .should("be.visible")
         .click();
      cy.get(cyInterfaceCHILD.page[parent].page[child].button.add)
         .should("be.visible")
         .click()
         .should("be.visible");
      cy.get(
         cyInterfaceCHILD.page[parent].page[child].form.add.fields[field]
      ).type(text);
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.button.save)
         .should("exist")
         .click();
      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .click({ force: true });
      cy.get(
         '[data-cy="ABViewGrid_6589f264-8e4d-4775-b90b-4e6f44cdeb52_datatable"]'
      ).should("be.visible");
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_6589f264-8e4d-4775-b90b-4e6f44cdeb52_datatable")
            .scrollTo(500, 0);
      });
      cy.get(cyInterfaceCHILD.page[parent].page[child].grid)
         .contains(text)
         .log();
   });
   it("Test generalCourses", () => {
      saveAndCheck("education", "generalCourses", "school");
   });
   it("Test file", () => {
      saveAndCheck("education", "schoolRecords", "subject");
   });

   // Logs //
   it("Test behaviorLog", () => {
      // Cannot click on already viewed child page
      let parent = "logs";
      let child = "behaviorLog";
      let field = "process";
      cy.log(parent, child, field);
      cy.get(cyInterfaceCHILD.tab[parent]).should("be.visible").click();
      //cy.get(cyInterfaceCHILD.page[parent].tab[child]).click().wait(200)
      cy.get(cyInterfaceCHILD.page[parent].page[child].button.add)
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCHILD.page[parent].page[child].form.add.fields[field]
      ).type(text);
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.button.save)
         .should("exist")
         .click();
      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .click({ force: true });
      cy.get(cyInterfaceCHILD.page[parent].page[child].grid)
         .contains(text)
         .log();
   });
   it("Test visitorLog", () => {
      //
      // TODO this has a lot more to test about it
      // sub-forms
      // [+] address
      // [+] visitor

      save("logs", "visitorLog", "details");
      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .click({ force: true });
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_75501667-a822-453a-a676-0e274977468e_datatable")
            .scrollTo(500, 0);
      });
      cy.get(
         '[data-cy="ABViewGrid_75501667-a822-453a-a676-0e274977468e_datatable"]'
      )
         .contains(text)
         .log();
   });
   // TODO: Make the form close when saved
   it("Test homeVisit", () => {
      save("logs", "homeVisit", "no");
      cy.get(
         '[data-cy="Popup Close Button Add Home Visit_94ba 1fadbc55-94ba-400c-9afc-56349a3c6375"]'
      )
         .should("exist")
         .click({ force: true });
      cy.get(".webix_warn")
         .find(".webix_button")
         .first()
         .should("be.visible")
         .click({ force: true });
      cy.get(cyInterfaceCHILD.page.logs.page.homeVisit.grid)
         .contains(text)
         .log();
   });
   it("Test participationLog", () => {
      saveAndCheck("logs", "participationLog", "behavior");
   });
   it("Test assetLog", () => {
      saveAndCheck("logs", "assetLog", "assetDescription");
   });
   it("Test contactingAgencies", () => {
      saveAndCheck("logs", "contactingAgencies", "name");
   });

   // Medical //
   it("Test vaccination", () => {
      save("medical", "vaccination", "otherVacc");
      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .first()
         .click({ force: true });
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_e626e03d-f322-4861-bcc9-9808a5b39f0c_datatable")
            .scrollTo(1200, 0);
      });
      cy.get(cyInterfaceCHILD.page.medical.page.vaccination.grid)
         .contains(text)
         .log();
   });
   it("Test healthInfo", () => {
      save("medical", "healthInfo", "injections");
      cy.get(".webix_warn")
         .find(".webix_button")
         .first() //Two buttons are in the dom need to get the first
         .should("be.visible")
         .click({ force: true });
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_cc56027a-81f0-4da0-8d56-eb7c91bee1a5_datatable")
            .scrollTo(1200, 0);
      });
      cy.get(cyInterfaceCHILD.page.medical.page.healthInfo.grid)
         .contains(text)
         .log();
   });
   it("Test medicalRecord", () => {
      saveAndCheck("medical", "medicalRecord", "symptoms");
   });
   it("Test growthLog", () => {
      save("medical", "growthLog", "note");
      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .click({ force: true });
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_11ae8a02-ba79-4e33-bf1f-dd3475e0ee2c_datatable")
            .scrollTo(1200, 0);
      });
      cy.get(cyInterfaceCHILD.page.medical.page.growthLog.grid)
         .contains(text)
         .log();
   });
   it("Test developmentLog", () => {
      save("medical", "developmentLog", "notes");
      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .click({ force: true });
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_c1304fbf-e972-4a14-b73a-976fca4823f1_datatable")
            .scrollTo(1200, 0);
      });
      cy.get(cyInterfaceCHILD.page.medical.page.developmentLog.grid)
         .contains(text)
         .log();
   });
   it("Test psychCheck", () => {
      save("medical", "psychCheck", "preAssessmentObservations");
      cy.get(".webix_warn")
         .find(".webix_button")
         .first() //Two buttons are in the dom need to get the first
         .should("be.visible")
         .click({ force: true });
      // cy.window().then((win) => {
      //    return win
      //       .$$("ABViewGrid_c1304fbf-e972-4a14-b73a-976fca4823f1_datatable")
      //       .scrollTo(1200, 0);
      // });
      cy.get(cyInterfaceCHILD.page.medical.page.psychCheck.grid)
         .contains(text)
         .log();
   });
   it("Test psychTest", () => {
      // todo tool adding
      saveAndCheck("medical", "psychTest", "educationLevel");
   });

   // Social Work //
   it("Test facts", () => {
      let parent = "socialWork";
      let child = "facts";
      let field = "details";
      cy.log(parent, child, field);
      cy.get(cyInterfaceCHILD.tab[parent]).should("be.visible").click();
      //cy.get(cyInterfaceCHILD.page[parent].tab[child]).click().wait(200)
      cy.get(cyInterfaceCHILD.page[parent].page[child].button.add)
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCHILD.page[parent].page[child].form.add.fields[field]
      ).type(text);
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.button.save)
         .should("exist")
         .click();
      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .click({ force: true });
      cy.get(cyInterfaceCHILD.page[parent].page[child].grid)
         .contains(text)
         .log();
   });
   //TODO: remove second save button
   it.skip("Test familyAssessment", () => {
      saveAndCheck("socialWork", "familyAssessment", "environment");
   });
   it("Test socialWelfare", () => {
      saveAndCheck("socialWork", "socialWelfare", "history");
   });
   it("Test lifePlan", () => {
      saveAndCheck("socialWork", "lifePlan", "action");
   });
   // it("Test lifePlan", () => {
   //   //
   //   // editPlan // goal
   //   saveAndCheck("socialWork","lifePlan","details")
   // })
});

// describe("Test Child:", () => {
//     before(() =>{
//         Common.ResetDB(cy);
//         cy.wait(1500);
//         Common.AuthLogin(cy);
//         importModule(moduleCARS);
//         cy.wait(1500);
//         sqlManager(moduleCARS, "init_db_for_updating_a_childs_data.sql");
//     });

//     beforeEach(() => {
//         Common.AuthLogin(cy);
//         // sqlManager(moduleCARS,"reset-db");
//         cy.wait(1500);
//         cy.visit("/").wait(2500);
//         childVisit();
//     });

// it("Test Viewing all Subpages", () => {

//     //arrange
//     const childrenIndex = 0;
//     const child = example.children[childrenIndex];

//     // act
//     cy.wait(1000);

//     // assert
//     //cyInterfaceCHILD
//     //this fails because the tab is already selected: cy.get(cyInterfaceCHILD.tab.basicInfo).click()
//     cy.get(cyInterfaceCHILD.page.basicInfo.tab.files).click().wait(100)
//     cy.get(cyInterfaceCHILD.page.basicInfo.tab.documents).click().wait(100)
//     cy.get(cyInterfaceCHILD.page.basicInfo.tab.admitInfo).click().wait(100)
//     cy.get(cyInterfaceCHILD.page.basicInfo.tab.basicInfo).click().wait(100)
//     //
//     cy.get(cyInterfaceCHILD.tab.relatives).click().wait(100)
//     //
//     cy.
//     get(cyInterfaceCHILD.tab.education).click().wait(250)
//     cy.get(cyInterfaceCHILD.page.education.tab.schoolRecords).click().wait(100)
//     cy.get(cyInterfaceCHILD.page.education.tab.generalCourses).click().wait(100)
//     cy.get(cyInterfaceCHILD.page.education.tab.careerInfo).click().wait(100)
//     cy.get(cyInterfaceCHILD.page.education.tab.educationInfo).click().wait(100);
//     //
//     cy.get(cyInterfaceCHILD.tab.logs).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.logs.tab.visitorLog).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.logs.tab.homeVisit).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.logs.tab.behaviorLog).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.logs.tab.participationLog).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.logs.tab.assetLog).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.logs.tab.contactingAgencies).click().wait(100);
//     //
//     cy.get(cyInterfaceCHILD.tab.medical).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.medical.tab.physicalDetails).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.medical.tab.vaccination).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.medical.tab.healthExam).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.medical.tab.healthInfo).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.medical.tab.medicalRecord).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.medical.tab.growthLog).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.medical.tab.developmentLog).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.medical.tab.psychCheck).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.medical.tab.psychTest).click().wait(100);
//     //
//     cy.get(cyInterfaceCHILD.tab.socialWork).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.socialWork.tab.familyAssessment).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.socialWork.tab.socialWelfare).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.socialWork.tab.files).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.socialWork.tab.lifePlan).click().wait(100);
//     cy.get(cyInterfaceCHILD.page.socialWork.tab.notes).click().wait(100); // if testing scope, this should be hidden

//     cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.basicInfo.page.basicInfo.field.typeReceived).should((data) => {
//         expect(data.text().includes(child.typeReceived) ? child.typeReceived: "", "Type Recieived").to.eq(child.typeReceived);
//     });
// });

// it("Test records auto generated by adding child", () => {
//     //act
//     // create child

//     //assert
//     // Basic info intact
//     // admit info generated
//     // prelim health exam generated
//     // physcial details generated
//     // vaccination generated (and connected)
//     // growth log generated
//     // asset log generated
// });

// it('should upload a pdf to the file picker', () => {
//   cy.fixture('./test_import/file.pdf').as('newpdf');

//   cy.get().then(function (el) {
//     const blob = Cypress.Blob.base64StringToBlob(this.newpdf, 'image/jpeg');

//     const file = new File([blob], './test_import/file.pdf', {
//       type: 'file/pdf'
//     });

//     const data = new DataTransfer();

//     data.items.add(file);

//     el[0].files = data.files;

//     const changeEvent = new Event('change', {
//       bubbles: true
//     });

//     el[0].dispatchEvent(changeEvent);
//   });

//   cy.get('#file-upload').next().next().should('be.visible');
// });

// it('should upload a file to the file picker', () => {
//   cy.get('#file-upload').attachFile('./test_import/file.pdf');

//   cy.get('#file-upload').next().next().should('be.visible');
// });
// });

// describe("Test Social Worker Note:", () => {
//     before(() =>{
//         Common.ResetDB(cy);
//         cy.wait(1500);
//         Common.AuthLogin(cy);
//         importModule(moduleCARS);
//         cy.wait(1500);
//     });

//     beforeEach(() => {
//         Common.AuthLogin(cy);
//         sqlManager(moduleCARS,"reset_db");
//         cy.wait(1500);
//     });

//     it("Test Edit Note", () => {

//         // arrange
//         const staff = example.staff[0];
//         const note = example.note[0];

//         //act
//         sqlManager(moduleCARS,"init_db_for_updating_existing_note.sql");
//         cy.visit("/").wait(2500);
//         navigator()
//         cy.wait(500);

//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.existingChildButton[0]).click({ force: true }).wait(500);
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.tab.socialWork).click().wait(250);
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.tab.notes).click().wait(1500);
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.grid)
//           .find(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.columns[0]).click( { multiple: true, force: true } ).wait(1000);

//           cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.grid)
//             .find(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.columns[0])
//             .find(".webix_cell").click( { multiple: true, force: true } ).wait(1000)

//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.editNote.field.title).clear().type(note.title);

//         // Date
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.editNote.field.date).click();
//         cy.get(".webix_cal_icon_clear").click()
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.editNote.field.date).type(note.date);
//         // cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.editNote.field.date).click();
//         // cy.get(".webix_cal_icon_today").click()

//         // TODO this has no data-cy
//         //cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.editNote.field.text).clear().type(note.text);

//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.editNote.field.file).click().wait(50);
//         cy.get('.selectivity-result-item').click();

//         // TODO multiple item bug again
//         // //cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.addCategory.label).type(note.category);
//         // cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.editNote.field.categories).click().wait(50);
//         // cy.get('.selectivity-result-item').click();

//         //save
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.editNote.button.save).click().wait(500);

//         // prepare for assertion
//         // click reload data button
//         // TODO replace with data-cy
//         //cy.find('.webix_view webix_control webix_el_button webix_primary webix_warn').click();

//         //assert
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.grid)
//           .find(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.columns[0])
//           .find(".webix_row_select")
//           .should((data) => {
//             cy.log(data)
//           });

//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.grid)
//           .find(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.columns[0])
//           .find(".webix_row_select")
//           .should((data) => {
//             expect(data.text().includes(note.title) ? note.title: "", "Title").to.eq(note.title);
//           })
//           .get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.grid)
//           .find(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.columns[1])
//           .find(".webix_row_select")
//           .should((data) => {
//             expect(data.text().includes(note.date) ? note.date: "", "Date").to.eq(note.date);
//           })
//           // .get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.grid)
//           // .find(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.columns[2])
//           // .find(".webix_row_select")
//           // .should((data) => {
//           //   expect(data.text().includes(note.text) ? note.text: "", "text").to.eq(note.text);
//           // })
//           // .get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.grid)
//           // .find(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.columns[3])
//           // .find(".webix_row_select")
//           // .should((data) => {
//           //   expect(data.text().includes(note.category) ? note.category: "", "category").to.eq(note.category);
//           // })
//           // 4 is the child
//           .find(".webix_ss_right")
//           .scrollTo("right")
//           .get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.grid)
//           .find(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.columns[5])
//           .find(".webix_row_select")
//           .should((data) => {
//             expect(data.text().includes(note.fileName) ? note.fileName: "", "fileName").to.eq(note.fileName);
//           });
//     });

//     it("Test Add New Note", () => {

//         // arrange
//         const staff = example.staff[0];
//         const note = example.note[0];
//         cy.log(note)
//         // TODO act
//         //sqlManager(moduleCARS,"init_db_for_adding_new_note.sql");
//         //cy.visit("/").wait(2500);
//         //navigator();

//         //act
//         //sqlManager(moduleCARS,"init_db_for_editing_a_child.sql");
//         sqlManager(moduleCARS,"init_db_for_adding_new_note.sql");
//         cy.visit("/").wait(2500);
//         navigator()
//         cy.wait(500);
//         //childVisit(childrenIndex);

//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.existingChildButton[0]).click({ force: true }).wait(500);
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.tab.socialWork).click().wait(250);
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.tab.notes).click().wait(250);
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.button.addNote).click().wait(1000).pause();
//         // It breaks here, form doesn't work

//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.addNote.field.title).type(note.title);
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.addNote.field.date).type(note.date);
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.addNote.field.text).type(note.text);
//         //id="tinymce"
//         //class="mce-content-body "
//         // cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.addNote.field.file).click();
//         // cy.get('.selectivity-result-item').click();
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.addNote.field.file)
//           .find('.fa fa-plus ab-connect-add-new-link').click();
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.addFile.label).type(note.fileName);

//         // cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.addNote.field.categories).click();
//         // cy.get('.selectivity-result-item').click();
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.addNote.field.categories)
//           .find('.fa fa-plus ab-connect-add-new-link').click();
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.addCategory.label).type(note.category);
//         //save
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.addNote.button.save).click();

//         // prepare for assertion
//         // click reload data button
//         // TODO replace with data-cy
//         cy.find('.webix_view webix_control webix_el_button webix_primary webix_warn').click();

//         // TODO: shouldn't need to wait.
//         cy.wait(500);

//         //assert
//         //tabindex="0"
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.basicInfo.page.basicInfo.field.idExpireDate).should((data) => {
//             expect(data.text().includes(child.idExpireDate) ? child.idExpireDate: "", "ID Expire Date").to.eq(child.idExpireDate);
//         });
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.basicInfo.page.basicInfo.field.idNumber).should((data) => {
//             expect(data.text().includes(child.idNumber) ? child.idNumber: "", "ID Number").to.eq(child.idNumber);
//         });
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.basicInfo.page.basicInfo.field.address).should((data) => {
//             expect(data.text().includes(child.address.addressNo) ? child.address.addressNo: "", "Address No").to.eq(child.address.addressNo);
//             expect(data.text().includes(` ${child.address.moo} `) ? child.address.moo: "", "Moo").to.eq(child.address.moo);
//             expect(data.text().includes(child.address.district) ? child.address.district: "", "District").to.eq(child.address.district);
//             expect(data.text().includes(child.address.city) ? child.address.city: "", "City").to.eq(child.address.city);
//             expect(data.text().includes(child.address.province) ? child.address.province: "", "Province").to.eq(child.address.province);
//             expect(data.text().includes(child.address.postalCode) ? child.address.postalCode: "", "Postal Code").to.eq(child.address.postalCode);
//         });
//         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.basicInfo.page.basicInfo.field.idIssueDate).should((data) => {
//             expect(data.text().includes(child.idIssueDate) ? child.idIssueDate: "", "ID Issue Date").to.eq(child.idIssueDate);
//         });
//     });

// });
