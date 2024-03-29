import * as Common from "../../../../setup/common.js";

import cyInterfaceCARS from "./test_setup/cy_interface/interface.json";
import cyInterfaceCHILD from "./test_setup/cy_interface/interface_child.json";

// Common Setup
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

// CARS Setup
const childVisit = () => {
   cy.get(cyInterfaceCommon.button.menu).should("be.visible").click();
   cy.get(cyInterfaceCARS.navigator).should("be.visible").click();
   cy.get(cyInterfaceCARS.tab.socialWorker).should("be.visible").click();
   cy.get(cyInterfaceCARS.page.socialWorker.tab.children)
      .should("be.visible")
      .click();
   cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.position)
      .should("be.visible")
      .click({ force: true });
};

// End to End Testing
describe("Test Social Worker Note:", () => {
   before(() => {
      Common.ResetDB(cy);
      Common.AuthLogin(cy);
      importModule();
   });

   beforeEach(() => {
      Common.AuthLogin(cy);
      Common.RunSQL(cy, folderName, ["reset_db.sql"]);
   });

   it("Test Edit Note", () => {
      // TODO Test Longtext Field

      //arrange
      const staff = "Alice";
      const note = {
         title: "Hello World",
         date: "01/01/2021",
         text: "This is a note etc etc",
      };

      //act
      Common.RunSQL(cy, folderName, ["init_db_for_updating_existing_note.sql"]);
      cy.visit("/");
      childVisit();

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.tab
            .socialWork
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.tab.notes
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      )
         .find(
            cyInterfaceCARS.page.socialWorker.page.children.view.child.page
               .socialWork.page.notes.columns[0]
         )
         .should("be.visible")
         .click({ multiple: true, force: true });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      )
         .find(
            cyInterfaceCARS.page.socialWorker.page.children.view.child.page
               .socialWork.page.notes.columns[0]
         )
         .find(".webix_cell")
         .should("be.visible")
         .click({ multiple: true, force: true });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.field.title
      )
         .clear()
         .type("Please work")
         .clear()
         .type(note.title);

      // Date
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.field.date
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.field.date
      )
         .clear()
         .type(note.date);
      // cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.editNote.field.date).click();
      // cy.get(".webix_cal_icon_today").click()
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.field.text
      )
         .click()
         .type(note.text);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.field.file
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.option.file[0]
      )
         .should("be.visible")
         .click();
      cy.get(".webix_button").contains("Select").click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.field.categories
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.option.categories[0]
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.field.categories
      )
         .should("be.visible")
         .click();

      // TODO multiple item bug again
      // cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.addCategory.label).type(note.category);
      // cy.get(
      //   cyInterfaceCARS.page.socialWorker.page.children.view.child.page
      //     .socialWork.page.notes.form.editNote.field.categories
      // ).click();
      // cy.get("[data-cy^=\"connectObject\"]").filter(':contains("123.file")').should("be.visible").click();
      // cy.get(
      //   cyInterfaceCARS.page.socialWorker.page.children.view.child.page
      //     .socialWork.page.notes.form.editNote.field.categories
      // ).click();

      //save
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.button.save
      )
         .should("be.visible")
         .click();

      //assert
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      )
         .find(
            cyInterfaceCARS.page.socialWorker.page.children.view.child.page
               .socialWork.page.notes.columns[1]
         )
         .find(".webix_row_select")
         .then((data) => {
            cy.log(data);
         });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      )
         .find(
            cyInterfaceCARS.page.socialWorker.page.children.view.child.page
               .socialWork.page.notes.columns[0]
         )
         .find(".webix_row_select")
         .should((data) => {
            expect(
               data.text().includes(note.title) ? note.title : "",
               "Title"
            ).to.eq(note.title);
         })
         .get(
            cyInterfaceCARS.page.socialWorker.page.children.view.child.page
               .socialWork.page.notes.grid
         )
         .find(
            cyInterfaceCARS.page.socialWorker.page.children.view.child.page
               .socialWork.page.notes.columns[1]
         )
         .find(".webix_row_select")
         .should((data) => {
            expect(
               data.text().includes(note.date) ? note.date : "",
               "Date"
            ).to.eq(note.date);
         });

      // .get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.grid)
      // .find(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.columns[2])
      // .find(".webix_row_select")
      // .contains(note.text)

      // .get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.grid)
      // .find(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.columns[3])
      // .find(".webix_row_select")
      // .should((data) => {
      //   expect(data.text().includes(note.category) ? note.category: "", "category").to.eq(note.category);
      // })
      // 4 is the child
      // .find(".webix_ss_right")
      // .scrollTo("right")

      // .get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.grid)
      // .find(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.columns[5])
      // .find(".webix_row_select")
      // .should((data) => {
      //    expect(data.text().includes(note.fileName) ? note.fileName : "", "fileName").to.eq(note.fileName);
      // });
   });

   // This example is acting very unpredictabaly.
   it("Test Add New Note", () => {
      //arrange
      const staff = "Alice";
      const note = {
         title: "Hello World",
         date: "01/01/2021",
         text: "This is a note etc etc",
         category: "Important Test",
         file: "123.file",
      };

      //act
      Common.RunSQL(cy, folderName, ["init_db_for_adding_new_note.sql"]);
      cy.visit("/");
      childVisit();

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.tab
            .socialWork
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.tab.notes
      )
         .should("be.visible")
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.button.addNote
      )
         .should("be.visible")
         .click();
      // It breaks here, form doesn't work

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.field.title
      )
         .should("be.visible")
         .type("Please work")
         .clear()
         .type(note.title);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.field.date
      ).type(note.date);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.field.date
      ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.field.categories
      )
         .should("be.visible")
         .parent()
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.option.categories[0]
      )
         .should("be.visible")
         .click();

      // TODO
      // cy.get(
      //    cyInterfaceCARS.page.socialWorker.page.children.view.child.page
      //       .socialWork.page.notes.form.addCategory.label
      // )
      //    .should("be.visible")
      //    .type("Please work")
      //    .clear()
      //    .type(note.category);

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.field.file
      )
         .should("be.visible")
         .parent()
         .click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.option.file[0]
      )
         .should("be.visible")
         .click();
      cy.get(".webix_button").contains("Select").click();

      // TODO
      // cy.get(
      //    cyInterfaceCARS.page.socialWorker.page.children.view.child.page
      //       .socialWork.page.notes.form.addFile.label
      // )
      //    .should("not.be.disabled")
      //    .type("Please work")
      //    .clear()
      //    .type(note.file);

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.field.text
      )
         .click()
         .type(note.text);

      //save
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.button.save
      ).click();
      cy.get(".webix_spin").should("not.be.visible");

      //assert
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      )
         .find(
            cyInterfaceCARS.page.socialWorker.page.children.view.child.page
               .socialWork.page.notes.columns[0]
         )
         .should((data) => {
            expect(
               data.text().includes(note.title) ? note.title : "",
               "Title"
            ).to.eq(note.title);
         })
         .get(
            cyInterfaceCARS.page.socialWorker.page.children.view.child.page
               .socialWork.page.notes.grid
         )
         .find(
            cyInterfaceCARS.page.socialWorker.page.children.view.child.page
               .socialWork.page.notes.columns[1]
         )
         .should((data) => {
            expect(
               data.text().includes(note.date) ? note.date : "",
               "Date"
            ).to.eq(note.date);
         });

      // .get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.grid)
      // .find(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.columns[2])
      // .find(".webix_row_select")
      // .should((data) => {
      //    expect(data.text().includes(note.text) ? note.text : "", "text").to.eq(note.text);
      // })

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      ).contains("Hello World");
      cy.get(
         '[data-cy="ABViewGrid_a2e24efa-2b3a-4f62-9861-62743e194689_datatable"]'
      ).should("be.visible");
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_a2e24efa-2b3a-4f62-9861-62743e194689_datatable")
            .scrollTo(500, 0);
      });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      ).contains(note.category);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      ).contains(note.file);
   });
});

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
      Common.RunSQL(cy, folderName, ["init_db_for_adding_new_form.sql"]);
      Common.AuthLogin(cy);
      cy.visit("/");
      childVisit();
   });

   const text = "Hello World";
   function save(parent, child, field, isTopTab) {
      if (!isTopTab) {
         cy.get(cyInterfaceCHILD.tab[parent]).should("be.visible").click();
         cy.get(cyInterfaceCHILD.page[parent].tab[child])
            .should("be.visible")
            .click();
      }
      cy.get(cyInterfaceCHILD.page[parent].page[child].button.add)
         .should("be.visible")
         .click();
      // wait for loading to go away

      cy.get('[class="webix_progress_state wxi-sync webix_spin"]')
         // eslint-disable-next-line prettier/prettier
         .should("not.be.visible");
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.fields[field])
         .scrollIntoView()
         .should("exist")
         .type("Please work", { force: true })
         .clear({ force: true })
         .type(text, { force: true });
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.button.save)
         .should("exist")
         .scrollIntoView()
         .click();
      cy.get(
         cyInterfaceCHILD.page[parent].page[child].form.add.fields[field]
      ).should("exist");
   }
   function saveAndCheck(parent, child, field, isTopTab) {
      // cy.log(parent, child, field);
      save(parent, child, field, isTopTab || null);
      // cy.get(".webix_warn")
      //    .find(".webix_button")
      //    .filter(":visible")
      //    .click({ multiple: true, force: true });
      cy.get('div[view_id*="ABViewTab_bbef30a6"]')
         .find(".webix_tree_item")
         .should("be.visible")
         .contains("Collapse Menu")
         .click({ force: true });
      cy.get(cyInterfaceCHILD.page[parent].page[child].grid).contains(text);
      checkForm(parent, child, field);
   }
   function checkForm(parent, child, field) {
      cy.get(cyInterfaceCHILD.page[parent].page[child].button.add)
         .should("be.visible")
         .click();

      // sometimes the NEW DATA dissapears on its own.
      // If it does this during the .get, cypress will
      // disconnect from the DOM; therefor it is better to wait
      cy.wait(50)
         .get("body")
         .then((body) => {
            if (body.find(".webix_warn").length > 0) {
               // hopefully it never gets here
               cy.log(
                  "WARNING! these forms should clear on load without getting clicked!!!"
               );
               cy.get(".webix_warn").should("not.be.visible");
               cy.get(
                  cyInterfaceCHILD.page[parent].page[child].form.add.fields[
                     field
                  ]
               )
                  .should("not.be.disabled")
                  .scrollIntoView()
                  .should("not.have.value", text);
            } else {
               cy.get(
                  cyInterfaceCHILD.page[parent].page[child].form.add.fields[
                     field
                  ]
               )
                  .should("not.be.disabled")
                  // .scrollIntoView()
                  .should("not.have.value", text);
            }
         });
      // clickIfExist("[class=\"webix_view webix_control webix_el_button webix_primary webix_warn\"]")
      // cy.get('button').contains("Click to reload")
   }

   it("Test file", () => {
      //act
      cy.get(cyInterfaceCHILD.page.basicInfo.tab.files)
         .should("be.visible")
         .click();
      //  saveAndCheck("basicInfo","files","label")
      cy.get(cyInterfaceCHILD.page.basicInfo.page.files.button.add)
         .should("be.visible")
         .click();

      cy.get('[class="webix_progress_state wxi-sync webix_spin"]').should(
         "not.be.visible"
      );
      cy.get(cyInterfaceCHILD.page.basicInfo.page.files.form.add.fields.label)
         .should("not.be.disabled")
         .type("Please work")
         .clear()
         .type(text);

      // TODO Add File

      cy.get(cyInterfaceCHILD.page.basicInfo.page.files.form.add.button.save)
         .should("exist")
         .click();

      // should contain new data in grid
      cy.get(cyInterfaceCHILD.page.basicInfo.page.files.grid).contains(text);
      checkForm("basicInfo", "files", "label");
   });

   // Checking the label of Initial Asset log
   it("Test the label 'No Item Reported' of Initial Asset log", () => {
      cy.get(cyInterfaceCHILD.page.basicInfo.tab.admitInfo)
         .should("exist")
         .click();
      cy.get(".webix_spin").should("not.be.visible");
      cy.get(
         '[data-cy="detail connected Child 9db31333-1cbf-429e-b3f7-46573a274054 8db15d0b-fd78-4b2b-975a-304b68a43054"]'
      )
         .should("be.visible")
         .contains("Nakamoto");
      cy.get(
         cyInterfaceCHILD.page.basicInfo.page.admitInfo.button.editAdmitInfo
      )
         .should("exist")
         .click();
      cy.get('div[view_id*="ABViewContainer_cf368115"]').should("exist");
      cy.get(
         cyInterfaceCHILD.page.basicInfo.page.admitInfo.form.editAdmitInfo.field
            .initialAssets
      ).should("exist");
      cy.get(
         cyInterfaceCHILD.page.basicInfo.page.admitInfo.form.editAdmitInfo.field
            .nameOfDeliverer
      )
         .type("slow")
         .clear()
         .type("concerned neighbor");
      cy.get(
         cyInterfaceCHILD.page.basicInfo.page.admitInfo.form.editAdmitInfo.field
            .initialBloodTest
      )
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.basicInfo.page.admitInfo.form.editAdmitInfo
            .option.initialBloodTest[0]
      )
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.basicInfo.page.admitInfo.form.editAdmitInfo
            .button.save
      )
         .scrollIntoView()
         .should("exist")
         .click({ force: true });
      cy.get(".webix_spin").should("not.be.visible");
      cy.get('div[view_id*="ABViewTab_bbef30a6"]')
         .find(".webix_tree_item")
         .should("be.visible")
         .contains("Collapse Menu")
         .click({ force: true });
      cy.get(cyInterfaceCHILD.page.basicInfo.page.admitInfo.grid).should(
         "be.visible"
      );
      cy.get(
         '[data-cy="detail connected Child 9db31333-1cbf-429e-b3f7-46573a274054 8db15d0b-fd78-4b2b-975a-304b68a43054"]'
      )
         .should("be.visible")
         .contains("Nakamoto");
      cy.get('[data-cy^="detail text Submitter Name"]')
         .should("be.visible")
         .contains("concerned neighbor");
      cy.get(
         '[data-cy="detail connected Initial Assets 6daf2109-4bbe-4003-b69d-bed120b83ec2 8db15d0b-fd78-4b2b-975a-304b68a43054"]'
      )
         .should("be.visible")
         .contains("no item reported");
   });

   // Education
   it("Test educationInfo", () => {
      let parent = "education";
      let child = "educationInfo";
      let field = "school";

      cy.get(cyInterfaceCHILD.tab[parent]).should("be.visible").click();
      cy.get(cyInterfaceCHILD.page[parent].page[child].button.add)
         .should("be.visible")
         .click();
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.fields[field])
         .type("Please work")
         .clear()
         .type(text);

      // Does Education Transcript field exist
      cy.get(".file-data-field-icon").should("be.visible");

      // TODO Add File Test

      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.button.save)
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page[parent].page[child].grid).contains(text);
      checkForm(parent, child, field);
   });

   it("Test careerInfo", () => {
      // TODO grid is too small, needs to scroll

      // saveAndCheck("education","careerInfo","workPlace")
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
         .click();
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.fields[field])
         .type("Please work")
         .clear()
         .type(text);
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.button.save)
         .should("exist")
         .click();
      cy.get(
         '[data-cy="ABViewGrid_6589f264-8e4d-4775-b90b-4e6f44cdeb52_datatable"]'
      ).should("be.visible");
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_6589f264-8e4d-4775-b90b-4e6f44cdeb52_datatable")
            .scrollTo(500, 0);
      });
      cy.get(cyInterfaceCHILD.page[parent].page[child].grid).contains(text);
      checkForm(parent, child, field);
   });

   it("Test generalCourses", () => {
      saveAndCheck("education", "generalCourses", "school");
   });

   it("Test file", () => {
      saveAndCheck("education", "schoolRecords", "subject");
   });

   it("Test Create and Edit Data of School Records", () => {
      cy.get(cyInterfaceCHILD.tab.education).should("be.visible").click();
      cy.get(cyInterfaceCHILD.page.education.tab.schoolRecords)
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.education.page.schoolRecords.button.add)
         .should("exist")
         .click();
      cy.get('div[view_id*="ABViewContainer_1eb85e88"]').should("be.visible");
      cy.get('div[view_id*="ABViewFormTextbox_d87b2981"]').should("exist");
      cy.get(
         cyInterfaceCHILD.page.education.page.schoolRecords.form.add.fields
            .classYear
      )
         .click({ force: true })
         .type("256", { force: true })
         .should("have.value", "256");
      cy.get(
         cyInterfaceCHILD.page.education.page.schoolRecords.form.add.fields.year
      )
         .scrollIntoView()
         .should("exist")
         .type("202", { force: true })
         .should("have.value", "202");
      cy.get(
         '[data-cy="button save bf3dfa10-80a5-455a-869d-c981daa2cdb3"] .webix_spin'
      ).should("not.exist");
      cy.get(
         cyInterfaceCHILD.page.education.page.schoolRecords.form.add.button.save
      )
         .scrollIntoView()
         .should("exist")
         .contains("Save")
         .click({ force: true });
      cy.get(".webix_spin").should("not.be.visible");
      cy.get(cyInterfaceCHILD.page.education.page.schoolRecords.grid)
         .should("be.visible")
         .contains("256");
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_2fae0fda-4262-4ef0-b1c8-e91fe2fc1d82_datatable")
            .scrollTo(1000, 1);
      });
      cy.get(cyInterfaceCHILD.page.education.page.schoolRecords.grid)
         .should("be.visible")
         .contains("202");
      cy.get(".wxi-pencil").should("be.visible").click({ force: true });
      cy.get(".webix_spin").should("not.be.visible");
      cy.get('div[view_id*="ABViewForm_3bf905ea"]').should("exist");
      cy.get(
         cyInterfaceCHILD.page.education.page.schoolRecords.form.add.fields
            .classYear
      )
         .should("exist")
         .click({ force: true })
         .type("3", { force: true })
         .should("have.value", "2563");
      cy.get(
         cyInterfaceCHILD.page.education.page.schoolRecords.form.add.fields.year
      )
         .scrollIntoView()
         .should("exist")
         .type("0", { force: true })
         .should("have.value", "2020");
      cy.get(
         '[data-cy="button save bf3dfa10-80a5-455a-869d-c981daa2cdb3"] .webix_spin'
      ).should("not.exist");
      cy.get(
         cyInterfaceCHILD.page.education.page.schoolRecords.form.add.button.save
      )
         .scrollIntoView()
         .should("exist")
         .contains("Save")
         .click({ force: true });
      cy.get(".webix_spin").should("not.be.visible");
      cy.get(cyInterfaceCHILD.page.education.page.schoolRecords.grid).should(
         "be.visible"
      );
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_2fae0fda-4262-4ef0-b1c8-e91fe2fc1d82_datatable")
            .scrollTo(1, 400);
      });
      cy.get(cyInterfaceCHILD.page.education.page.schoolRecords.grid)
         .should("be.visible")
         .contains("2563");
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_2fae0fda-4262-4ef0-b1c8-e91fe2fc1d82_datatable")
            .scrollTo(1200, 1);
      });
      cy.get(cyInterfaceCHILD.page.education.page.schoolRecords.grid)
         .should("be.visible")
         .contains("2020");
   });

   // Logs
   it("Test behaviorLog", () => {
      cy.get(cyInterfaceCHILD.tab.logs).should("be.visible").click();
      cy.get(cyInterfaceCHILD.page.logs.tab.behaviorLog)
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.logs.page.behaviorLog.button.add)
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.behaviorLog.form.add.fields.process
      )
         .should("exist")
         .type(text);
      cy.get(
         cyInterfaceCHILD.page.logs.page.behaviorLog.form.add.fields.recordedBy
      )
         .scrollIntoView()
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.behaviorLog.form.add.option
            .recordedBy[0]
      )
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.logs.page.behaviorLog.form.add.button.save)
         .scrollIntoView()
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.logs.page.behaviorLog.grid)
         .should("be.visible")
         .contains(text);
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_c2e31c4e-8a5d-4bc0-bafe-4db95ff03d69_datatable")
            .scrollTo(600, 0);
      });
      cy.get(cyInterfaceCHILD.page.logs.page.behaviorLog.grid)
         .should("be.visible")
         .contains("John Lennon");
   });

   it("Test visitorLog", () => {
      cy.get(cyInterfaceCHILD.tab.logs).should("be.visible").click();
      cy.get(cyInterfaceCHILD.page.logs.tab.visitorLog).should("exist").click();
      cy.get(cyInterfaceCHILD.page.logs.page.visitorLog.button.add)
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.logs.page.visitorLog.form.add.fields.child)
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.visitorLog.form.add.option.child[0]
      )
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.logs.page.visitorLog.form.add.fields.visitor)
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.visitorLog.form.add.option.visitor[0]
      )
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.logs.page.visitorLog.form.add.fields.address)
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.visitorLog.form.add.option.address[0]
      )
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.visitorLog.form.add.fields.recordedBy
      )
         .scrollIntoView()
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.visitorLog.form.add.option
            .recordedBy[0]
      )
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.logs.page.visitorLog.form.add.button.save)
         .scrollIntoView()
         .should("exist")
         .click();
      cy.get(".wxi-pencil").should("be.visible").click({ force: true });
      cy.get(
         cyInterfaceCHILD.page.logs.page.visitorLog.form.edit.fields.visitor
      )
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.visitorLog.form.edit.option.visitor[0]
      )
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.visitorLog.form.edit.fields.address
      )
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.visitorLog.form.edit.option.address[0]
      )
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.logs.page.visitorLog.form.edit.button.save)
         .scrollIntoView()
         .should("exist")
         .click();
      cy.get(".webix_spin").should("not.be.visible");
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_75501667-a822-453a-a676-0e274977468e_datatable")
            .scrollTo(600, 0);
      });
      cy.get(cyInterfaceCHILD.page.logs.page.visitorLog.grid)
         .should("be.visible")
         .contains("AlanSmith");
   });

   it("Test homeVisit", () => {
      cy.get(cyInterfaceCHILD.tab.logs).should("be.visible").click();
      cy.get(cyInterfaceCHILD.page.logs.tab.homeVisit).should("exist").click();
      cy.get(cyInterfaceCHILD.page.logs.page.homeVisit.button.add)
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.logs.page.homeVisit.form.add.fields.visitNo)
         .should("exist")
         .type("Please work", { force: true })
         .clear()
         .type(text);
      cy.get(cyInterfaceCHILD.page.logs.page.homeVisit.form.add.fields.address)
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.homeVisit.form.add.option.address[0]
      )
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.logs.page.homeVisit.form.add.fields.contact)
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.homeVisit.form.add.option.contact[0]
      )
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.homeVisit.form.add.fields.familyMembers
      )
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.homeVisit.form.add.option
            .familyMembers[0]
      )
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.logs.page.homeVisit.form.add.fields.siteUrl)
         .scrollIntoView()
         .should("exist")
         .type("www.google.com");
      cy.get(cyInterfaceCHILD.page.logs.page.homeVisit.form.add.button.save)
         .scrollIntoView()
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.logs.page.homeVisit.grid)
         .should("be.visible")
         .contains(text);
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_cc01e916-b85d-4470-8e95-ebe1cded8477_datatable")
            .scrollTo(1600, 0);
      });
      cy.get(cyInterfaceCHILD.page.logs.page.homeVisit.grid)
         .should("be.visible")
         .contains("www.google.com");
   });

   it("Test participationLog", () => {
      cy.get(cyInterfaceCHILD.tab.logs).should("be.visible").click();
      cy.get(cyInterfaceCHILD.page.logs.tab.participationLog)
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.logs.page.participationLog.button.add)
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.participationLog.form.add.fields
            .behavior
      )
         .should("exist")
         .type(text);
      cy.get(
         cyInterfaceCHILD.page.logs.page.participationLog.form.add.fields
            .recordedBy
      )
         .scrollIntoView()
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.participationLog.form.add.option
            .recordedBy[0]
      )
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.participationLog.form.add.button.save
      )
         .scrollIntoView()
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.logs.page.participationLog.grid)
         .should("be.visible")
         .contains(text);
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_8d8ee503-9a5e-4f81-ad8b-07d4b9133f59_datatable")
            .scrollTo(600, 0);
      });
      cy.get(cyInterfaceCHILD.page.logs.page.participationLog.grid)
         .should("be.visible")
         .contains("John Lennon");
   });

   it("Test assetLog", () => {
      cy.get(cyInterfaceCHILD.tab.logs).should("be.visible").click();
      cy.get(cyInterfaceCHILD.page.logs.tab.assetLog)
         .should("be.visible")
         .click();
      cy.get(cyInterfaceCHILD.page.logs.page.assetLog.button.add)
         .should("be.visible")
         .click();
      cy.get('[class="webix_progress_state wxi-sync webix_spin"]').should(
         "not.be.visible"
      );
      cy.get(
         cyInterfaceCHILD.page.logs.page.assetLog.form.add.fields
            .assetDescription
      )
         .scrollIntoView()
         .should("exist")
         .type("Please work", { force: true })
         .clear()
         .type(text);
      cy.get(cyInterfaceCHILD.page.logs.page.assetLog.form.add.button.save)
         .should("exist")
         .scrollIntoView()
         .click();
      cy.get(
         cyInterfaceCHILD.page.logs.page.assetLog.form.add.fields
            .assetDescription
      ).should("exist");
      cy.get(cyInterfaceCHILD.page.logs.page.assetLog.grid).contains(text);
   });

   it("Test contactingAgencies", () => {
      saveAndCheck("logs", "contactingAgencies", "name");
   });

   // Medical
   it("Test vaccination", () => {
      saveAndCheck("medical", "vaccination", "otherVacc");
   });

   it("Test healthInfo", () => {
      cy.get(cyInterfaceCHILD.tab.medical).should("be.visible").click();
      cy.get(cyInterfaceCHILD.page.medical.tab.healthInfo)
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.medical.page.healthInfo.button.add)
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.medical.page.healthInfo.form.add.fields
            .injections
      )
         .should("exist")
         .type(text, { force: true })
         .clear()
         .type(text, { force: true }); // Type Again
      cy.get(cyInterfaceCHILD.page.medical.page.healthInfo.form.add.button.save)
         .scrollIntoView()
         .should("exist")
         .click({ force: true });
      cy.get(cyInterfaceCHILD.page.medical.page.healthInfo.grid)
         .should("be.visible")
         .contains(text);
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_cc56027a-81f0-4da0-8d56-eb7c91bee1a5_datatable")
            .scrollTo(1600, 0);
      });
      cy.get(cyInterfaceCHILD.page.medical.page.healthInfo.grid)
         .should("be.visible")
         .and("contain", "A +")
         .and("contain", "Negative");
   });

   it("Test medicalRecord", () => {
      saveAndCheck("medical", "medicalRecord", "symptoms");
   });

   it("Test growthLog", () => {
      save("medical", "growthLog", "note");
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_11ae8a02-ba79-4e33-bf1f-dd3475e0ee2c_datatable")
            .scrollTo(1200, 0);
      });
      cy.get(cyInterfaceCHILD.page.medical.page.growthLog.grid).contains(text);
      checkForm("medical", "growthLog", "note");
   });

   it("Test developmentLog", () => {
      cy.get(cyInterfaceCHILD.tab.medical).should("be.visible").click();
      cy.get(cyInterfaceCHILD.page.medical.tab.developmentLog)
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.medical.page.developmentLog.button.add)
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.medical.page.developmentLog.form.add.fields
            .developmentType
      )
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.medical.page.developmentLog.form.add.option
            .developmentType[0]
      )
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.medical.page.developmentLog.form.add.fields.notes
      )
         .should("exist")
         .type(text);
      cy.get(
         cyInterfaceCHILD.page.medical.page.developmentLog.form.add.fields
            .recordedBy
      )
         .scrollIntoView()
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.medical.page.developmentLog.form.add.option
            .recordedBy[0]
      )
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.medical.page.developmentLog.form.add.button.save
      )
         .scrollIntoView()
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.medical.page.developmentLog.grid)
         .should("be.visible")
         .contains("Social Dev");
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_c1304fbf-e972-4a14-b73a-976fca4823f1_datatable")
            .scrollTo(600, 0);
      });
      cy.get(cyInterfaceCHILD.page.medical.page.developmentLog.grid)
         .should("be.visible")
         .contains("John Lennon");
   });

   it("Test psychCheck", () => {
      saveAndCheck("medical", "psychCheck", "preAssessmentObservations");
      // cy.get(".webix_warn")
      //    .find(".webix_button")
      //    .first() //Two buttons are in the dom need to get the first
      //    .should("be.visible")
      //    .click();
      // cy.window().then((win) => {
      //    return win
      //       .$$("ABViewGrid_c1304fbf-e972-4a14-b73a-976fca4823f1_datatable")
      //       .scrollTo(1200, 0);
      // });
      // cy.get(cyInterfaceCHILD.page.medical.page.psychCheck.grid)
      //    .contains(text)
      //    .log();
      // checkForm("medical", "psychCheck", "preAssessmentObservations");
   });

   it("Test psychTest", () => {
      cy.get(cyInterfaceCHILD.tab.medical).should("be.visible").click();
      cy.get(cyInterfaceCHILD.page.medical.tab.psychTest)
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.medical.page.psychTest.button.add)
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.medical.page.psychTest.form.add.fields
            .educationLevel
      )
         .should("exist")
         .type(text);
      cy.get(
         cyInterfaceCHILD.page.medical.page.psychTest.form.add.fields.psychTool
      )
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.medical.page.psychTest.form.add.option
            .psychTool[0]
      )
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.medical.page.psychTest.form.add.fields.psychTool
      )
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.medical.page.psychTest.form.add.fields
            .psychologist
      )
         .should("exist")
         .type("Welcome");
      cy.get(cyInterfaceCHILD.page.medical.page.psychTest.form.add.button.save)
         .scrollIntoView()
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.medical.page.psychTest.grid)
         .should("be.visible")
         .contains(text);
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_5faf2ee0-dbf7-4567-942f-069a4a18dc16_datatable")
            .scrollTo(1200, 0);
      });
      cy.get(cyInterfaceCHILD.page.medical.page.psychTest.grid)
         .should("be.visible")
         .contains("Welcome");
   });

   // Social Work
   it("Test facts", () => {
      let parent = "socialWork";
      let child = "facts";
      let field = "details";

      cy.log(parent, child, field);
      cy.get(cyInterfaceCHILD.tab[parent]).should("be.visible").click();
      saveAndCheck(parent, child, field, true);
   });

   it("Test familyAssessment", () => {
      let parent = "socialWork";
      let child = "familyAssessment";
      let field = "environment";

      // cy.log(parent, child, field);if (!isTopTab) {
      cy.get(cyInterfaceCHILD.tab[parent]).should("be.visible").click();
      cy.get(cyInterfaceCHILD.page[parent].tab[child])
         .should("be.visible")
         .click();
      cy.get(cyInterfaceCHILD.page[parent].page[child].button.add)
         .should("be.visible")
         .click();
      // wait for loading to go away

      cy.get('[class="webix_progress_state wxi-sync webix_spin"]').should(
         "not.be.visible"
      );
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.fields[field])
         .scrollIntoView()
         .should("exist")
         .type("Please work")
         .clear()
         .type(text);
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.button.save)
         .should("exist")
         .scrollIntoView()
         .click({ force: true });
      cy.get(
         cyInterfaceCHILD.page[parent].page[child].form.add.button.save
      ).should("not.exist"); // wait until popup goes away
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_264a4c42-2647-4be8-90b4-42a2d82d8ea6_datatable")
            .scrollTo(400, 1);
      });
      cy.get(cyInterfaceCHILD.page[parent].page[child].grid).contains(text);
      checkForm(parent, child, field);
   });

   it("Test socialWelfare", () => {
      cy.get(cyInterfaceCHILD.tab.socialWork).should("be.visible").click();
      cy.get(cyInterfaceCHILD.page.socialWork.tab.socialWelfare)
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.socialWork.page.socialWelfare.button.add)
         .should("exist")
         .click();
      cy.get(
         cyInterfaceCHILD.page.socialWork.page.socialWelfare.form.add.fields
            .history
      )
         .should("exist")
         .type(text);
      cy.get(
         cyInterfaceCHILD.page.socialWork.page.socialWelfare.form.add.button
            .save
      )
         .scrollIntoView()
         .should("exist")
         .click();
      cy.get(cyInterfaceCHILD.page.socialWork.page.socialWelfare.grid)
         .should("be.visible")
         .contains(text);
   });

   it("Test lifePlan", () => {
      let parent = "socialWork";
      let child = "lifePlan";
      let field = "action";

      save(parent, child, field, null);
      // cy.get(".webix_warn").find(".webix_button").filter(":visible").click();
      cy.get(cyInterfaceCHILD.page[parent].page[child].grid).contains(text);
      checkForm(parent, child, field);
   });
});
