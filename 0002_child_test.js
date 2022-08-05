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
      // TODO test longtext field

      // arrange
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
      cy.get(".webix_cal_icon_clear").click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.field.date
      ).type(note.date);
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
         '[data-cy^="connectObject options 16c2d1b8-4bbe-4f8d-b80e-5dc9ab61846c bd49d7b7-697b-4f0f-a4f4-12ca407fdc65 8129e697-a2a3-4fd1-a576-ec758cd54662"]'
      )
         .should("be.visible")
         .click();

      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.editNote.field.text
      ).click();

      // TODO multiple item bug again
      // //cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.addCategory.label).type(note.category);
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

      // prepare for assertion

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
         .should((data) => {
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

   // this example is acting very unpredictabaly.
   it("Test Add New Note", () => {
      // arrange
      const staff = "Alice";
      const note = {
         title: "Hello World",
         date: "01/01/2021",
         text: "This is a note etc etc",
         category: "New Category",
         file: "New File",
      };

      // act
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
            .socialWork.page.notes.form.addNote.field.file
      )
         .parent()
         .find(".fa-plus")
         .click({ force: true });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addFile.label
      )
         .should("not.be.disabled")
         .type("Please work")
         .clear()
         .type(note.file);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addFile.button.save
      )
         .filter(":visible")
         .click();
      cy.get(".webix_spin").should("not.be.visible");
      // uncomment these when fixed
      // .should("not.be.visible");
      // cy.get(
      //    cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.addNote.field.file
      // ).contains("New File");
      cy.log("This popup should close here: Please fix it");

      // Remove starting here
      cy.log(
         "Placeholder things to make test complete: if the popup close is fixed these will need to be removed."
      );
      cy.get(".webix_button")
         .filter(":visible")
         .contains("Close")
         .click({ force: true, multiple: true });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.field.file
      )
         .find(".webix_multicombo_input")
         .click({ force: true });
      // cy.get(".webix_list_item")
      //    .contains("New File")
      //    .click({ force: true });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.field.title
      ).click();
      // END REMOVE

      // cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.addNote.field.categories).click();
      // cy.get('.selectivity-result-item').click();
      // cy.get(
      //    cyInterfaceCARS.page.socialWorker.page.children.view.child.page
      //       .socialWork.page.notes.form.addNote.add.category
      // ).click();
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.field.categories
      )
         .parent()
         .find(".fa-plus")
         .click({ force: true });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addCategory.label
      )
         .should("be.visible")
         .type("Please work")
         .clear()
         .type(note.category);
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addCategory.button.save
      )
         .filter(":visible")
         .click();
      cy.get(".webix_spin").should("not.be.visible");
      // cy.get(
      //    cyInterfaceCARS.page.socialWorker.page.children.view.child.page.socialWork.page.notes.form.addNote.field.categories
      // )
      //    .contains("Important Test Notes")

      cy.log("This popup should close here: Please fix it");
      // Remove starting here
      cy.log(
         "Placeholder things to make test complete: if the popup close is fixed these will need to be removed."
      );
      cy.get(".webix_button")
         .filter(":visible")
         .contains("Close")
         .click({ force: true, multiple: true });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.field.categories
      )
         .find(".webix_multicombo_input")
         .click();
      // cy.get(".webix_list_item")
      //    .contains("New ")
      //    .parent()
      //    .click({ force: true });
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.field.title
      ).click();
      // END REMOVE

      //save
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.form.addNote.button.save
      ).click();

      cy.get(".webix_spin").should("not.be.visible");

      // prepare for assertion
      // click reload data button
      // TODO replace with data-cy
      cy.get(".webix_button").contains("Click to reload").click();

      //assert

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
      // .should((data) => {
      //    expect(data.text().includes(note.text) ? note.text : "", "text").to.eq(note.text);
      // })
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      ).contains("Hello World");
      cy.get(
         cyInterfaceCARS.page.socialWorker.page.children.view.child.page
            .socialWork.page.notes.grid
      ).contains(note.category);
      // cy.get(
      //    cyInterfaceCARS.page.socialWorker.page.children.view.child.page
      //       .socialWork.page.notes.grid
      // ).contains(note.file);
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
      // eslint-disable-next-line prettier/prettier
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
         // .scrollIntoView()
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
      cy.get(".webix_warn")
         .find(".webix_button")
         .filter(":visible")
         .click({ multiple: true, force: true });
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
      //
      // TODO add file
      //
      cy.get(cyInterfaceCHILD.page.basicInfo.page.files.form.add.button.save)
         .should("exist")
         .click();

      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .click({ multiple: true, force: true });
      // should contain new data in grid
      cy.get(cyInterfaceCHILD.page.basicInfo.page.files.grid).contains(text);
      checkForm("basicInfo", "files", "label");
   });

   // Checking the label of Initial Asset log
   it("Test the label 'No Item Reported' of Initial Asset log", () => {
      cy.get(cyInterfaceCHILD.page.basicInfo.tab.admitInfo)
         .should("exist")
         .click();
      cy.get('[data-cy="menu-item Admission Info_3a46 cf368115-3a46-434b-b44e-6104b9bdb592 f076f340-9d27-45cf-b75e-c0930506235e"]')
         .should("exist")
         .click();
      cy.get('div[view_id*="ABViewContainer_cf368115"]')
         .should("exist");
      cy.get('[data-cy="connectObject Initial Assets 6daf2109-4bbe-4003-b69d-bed120b83ec2 575cd5ba-b217-46f1-9ab1-9ee67555daad"]')
         .scrollIntoView()
         .should("exist");
      cy.get('[data-cy="button save 575cd5ba-b217-46f1-9ab1-9ee67555daad"]')
         .scrollIntoView()
         .should("exist")
         .click({ force: true });
      cy.get('[data-cy="Detail Admit Info 8db15d0b-fd78-4b2b-975a-304b68a43054"]')
         .should("be.visible");
      cy.get('[data-cy="detail connected Initial Assets 6daf2109-4bbe-4003-b69d-bed120b83ec2 8db15d0b-fd78-4b2b-975a-304b68a43054"]')
         .should("be.visible");
      cy.get('[data-cy="menu-item Admission Info_3a46 cf368115-3a46-434b-b44e-6104b9bdb592 f076f340-9d27-45cf-b75e-c0930506235e"]')
         .should("exist")
         .click();
      cy.get('div[view_id*="ABViewContainer_cf368115"]')
         .should("exist");
      cy.get(".webix_warn")
         .find(".webix_button")
         .scrollIntoView()
         .contains("New data available")
         .click({ force: true });
      cy.get('[data-cy="connectObject Initial Assets 6daf2109-4bbe-4003-b69d-bed120b83ec2 575cd5ba-b217-46f1-9ab1-9ee67555daad"]')
         .scrollIntoView()
         .should("exist")
         .click({ force: true });
      cy.get(".webix_el_box")
         .find('input[type="combo"]')
         .eq(3)
         .should("exist")
         .click({ force: true });
      cy.get('[data-cy="button save 575cd5ba-b217-46f1-9ab1-9ee67555daad"]')
         .scrollIntoView()
         .should("exist")
         .click({ force: true });
      cy.get('[data-cy="Detail Admit Info 8db15d0b-fd78-4b2b-975a-304b68a43054"]')
         .should("be.visible");
      cy.get('[data-cy="detail connected Initial Assets 6daf2109-4bbe-4003-b69d-bed120b83ec2 8db15d0b-fd78-4b2b-975a-304b68a43054"]')
         .should("be.visible");
      cy.visit("/");
      cy.get(
         '[data-cy="dataview item Children 0e41a300-4698-40c8-9c5f-f96ea2ceadf6 b3aa04d7-7528-40fb-b947-cef0c4dd52e9"]'
      )
         .should("exist")
         .click({ force: true });
      cy.get(
         '[data-cy="tab-AdmitInfo-5b134ce2-7f78-473f-8b0b-e538fcfcf779-a6be43b2-27fc-4b60-aaed-1627393b52da"]'
      )
         .should("exist")
         .click();
      cy.get('div[view_id*="ABViewTab_bbef30a6"]')
         .find(".webix_tree_item")
         .should("be.visible")
         .contains("Collapse Menu")
         .click({ force: true });
      cy.get('[data-cy="Detail Admit Info 8db15d0b-fd78-4b2b-975a-304b68a43054"]')
         .should("be.visible");
      cy.get(
         '[data-cy="detail connected Child 9db31333-1cbf-429e-b3f7-46573a274054 8db15d0b-fd78-4b2b-975a-304b68a43054"]'
      )
         .should("be.visible")
         .contains("Nakamoto");
      cy.get('[data-cy="detail connected Initial Assets 6daf2109-4bbe-4003-b69d-bed120b83ec2 8db15d0b-fd78-4b2b-975a-304b68a43054"]')
         .should("be.visible")
         .contains("No Item Reported");
   });

   // Education //
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
      // TODO add file test
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.button.save)
         .should("exist")
         .click();
      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .click({ multiple: true, force: true });
      cy.get(cyInterfaceCHILD.page[parent].page[child].grid).contains(text);
      checkForm(parent, child, field);
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
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.fields[field])
         .type("Please work")
         .clear()
         .type(text);
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.button.save)
         .should("exist")
         .click();
      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .click({ multiple: true, force: true });
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
      cy.get(
         '[data-cy="tab-Education-55641379-f712-497c-abe8-7a7b3e3091e0-bbef30a6-8b04-49c3-8520-818568ccaa79"]'
      )
         .should("be.visible")
         .click();
      cy.get(
         '[data-cy="tab-SchoolRecords-ea8b6c3b-84f5-43ed-8f1c-65d0e73b0edc-d071e58a-baa8-4312-b8df-320b5f04c22a"]'
      )
         .should("exist")
         .click();
      cy.get(
         '[data-cy="menu-item Add School Records 1eb85e88-a729-48fd-a7fc-cc1d3072f843 e520d8da-6e67-4b8f-a88f-2004c81ec813"]'
      )
         .should("exist")
         .click();
      cy.get('div[view_id*="ABViewContainer_1eb85e88"]').should("be.visible");
      cy.get('div[view_id*="ABViewFormTextbox_d87b2981"]').should("exist");
      cy.get(
         '[data-cy="string Class Year 7e4a4937-f4a4-4ad7-95ae-06cb80c798dc bf3dfa10-80a5-455a-869d-c981daa2cdb3"]'
      )
         .click({ force: true })
         .type("256", { force: true })
         .should("have.value", "256");
      cy.get(
         '[data-cy="string Year 3508a12a-ab10-4a86-9b8a-cabfafd354aa bf3dfa10-80a5-455a-869d-c981daa2cdb3"]'
      )
         .scrollIntoView()
         .should("exist")
         .type("202");
      cy.get('[data-cy="button save bf3dfa10-80a5-455a-869d-c981daa2cdb3"]')
         .scrollIntoView()
         .should("exist")
         .contains("Save")
         .click();
      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .click({ multiple: true, force: true });
      cy.get(
         '[data-cy="ABViewGrid_2fae0fda-4262-4ef0-b1c8-e91fe2fc1d82_datatable"]'
      )
         .should("be.visible")
         .contains("256");
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_2fae0fda-4262-4ef0-b1c8-e91fe2fc1d82_datatable")
            .scrollTo(400, 1);
      });
      cy.get(
         '[data-cy="ABViewGrid_2fae0fda-4262-4ef0-b1c8-e91fe2fc1d82_datatable"]'
      )
         .should("be.visible")
         .contains("202");
      cy.get(".wxi-pencil").should("be.visible").click({ force: true });
      cy.get('div[view_id*="ABViewForm_3bf905ea"]').should("be.visible");
      cy.get(
         '[data-cy="string Class Year 7e4a4937-f4a4-4ad7-95ae-06cb80c798dc 3bf905ea-5a83-4412-a89e-5991325ae3a2"]'
      )
         .should("exist")
         .click({ force: true })
         .type("3");
      cy.get(
         '[data-cy="string Year 3508a12a-ab10-4a86-9b8a-cabfafd354aa 3bf905ea-5a83-4412-a89e-5991325ae3a2"]'
      )
         .scrollIntoView()
         .should("exist")
         .type("0");
      cy.get('[data-cy="button save 3bf905ea-5a83-4412-a89e-5991325ae3a2"]')
         .scrollIntoView()
         .should("exist")
         .contains("Save")
         .click({ force: true });
      cy.get(
         '[data-cy="ABViewGrid_2fae0fda-4262-4ef0-b1c8-e91fe2fc1d82_datatable"]'
      ).should("be.visible");
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_2fae0fda-4262-4ef0-b1c8-e91fe2fc1d82_datatable")
            .scrollTo(1, 400);
      });
      cy.get(
         '[data-cy="ABViewGrid_2fae0fda-4262-4ef0-b1c8-e91fe2fc1d82_datatable"]'
      )
         .should("be.visible")
         .contains("2563");
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_2fae0fda-4262-4ef0-b1c8-e91fe2fc1d82_datatable")
            .scrollTo(400, 1);
      });
      cy.get(
         '[data-cy="ABViewGrid_2fae0fda-4262-4ef0-b1c8-e91fe2fc1d82_datatable"]'
      )
         .should("be.visible")
         .contains("2020");
   });

   // Logs //
   it("Test behaviorLog", () => {
      // Cannot click on already viewed child page
      let parent = "logs";
      let child = "behaviorLog";
      let field = "process";
      cy.get(cyInterfaceCHILD.tab[parent]).should("be.visible").click();
      saveAndCheck(parent, child, field, true);
   });
   it("Test visitorLog", () => {
      // TODO this has a lot more to test about it
      // sub-forms
      // [+] address
      // [+] visitor

      save("logs", "visitorLog", "details");
      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .click({ multiple: true, force: true });
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_75501667-a822-453a-a676-0e274977468e_datatable")
            .scrollTo(500, 0);
      });
      cy.get(
         '[data-cy="ABViewGrid_75501667-a822-453a-a676-0e274977468e_datatable"]'
      ).contains(text);
      checkForm("logs", "visitorLog", "details");
   });
   it("Test homeVisit", () => {
      let parent = "logs";
      let child = "homeVisit";
      let field = "no";

      cy.get(cyInterfaceCHILD.tab[parent]).should("be.visible").click();
      cy.get(cyInterfaceCHILD.page[parent].tab[child])
         .should("be.visible")
         .click();

      cy.get(cyInterfaceCHILD.page[parent].page[child].button.add)
         .should("be.visible")
         .click();
      // wait for loading to go away
      // eslint-disable-next-line prettier/prettier
      cy.get('[class="webix_progress_state wxi-sync webix_spin"]')
         // eslint-disable-next-line prettier/prettier
         .should("not.be.visible");
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.fields[field])
         .scrollIntoView()
         .should("exist")
         .type("Please work", { force: true })
         .clear()
         .type(text);
      // Scroll to see and type the URL location on 'Site URL Field'
      cy.get(
         '[data-cy="string Site URL 72ca73ce-9e1b-4f18-8076-face07e38f95 a0658515-5b59-48de-9176-d0822a97fdc9"]'
      )
         .scrollIntoView()
         .should("exist")
         .type("www.google.com");
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.button.save)
         // .scrollIntoView()
         .should("exist")
         .scrollIntoView()
         .click();
      cy.get(
         cyInterfaceCHILD.page[parent].page[child].form.add.fields[field]
      ).should("not.be.visible"); // wait until popup goes away
      cy.get(
         '[data-cy="string Site URL 72ca73ce-9e1b-4f18-8076-face07e38f95 a0658515-5b59-48de-9176-d0822a97fdc9"]'
      ).should("not.be.visible"); // wait until popup goes away
      cy.get(".webix_warn")
         .find(".webix_button")
         .filter(":visible")
         .click({ multiple: true, force: true });
      cy.get(cyInterfaceCHILD.page[parent].page[child].grid).contains(text);

      // Scroll to see the 'Site URL Field'
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_cc01e916-b85d-4470-8e95-ebe1cded8477_datatable")
            .scrollTo(1400, 1);
      });
      // Should see 'www.google.com' in the Site URL Field
      cy.get(
         '[data-cy="ABViewGrid_cc01e916-b85d-4470-8e95-ebe1cded8477_datatable"]'
      ).contains("www.google.com");
      checkForm(parent, child, field);
   });
   it("Test participationLog", () => {
      saveAndCheck("logs", "participationLog", "behavior");
   });
   it("Test assetLog", () => {
      cy.get(
         '[data-cy="tab-Logs-30406204-b89c-4322-bff0-d07cd6be4404-bbef30a6-8b04-49c3-8520-818568ccaa79"]'
      ).should("be.visible").click();
      cy.get(
         '[data-cy="tab-AssetLog-41efe1e0-c6ee-4abb-b67a-5871150b882f-9f5b25fb-c8f6-4fc4-adf1-4172cb0c7393"]'
      ).should("be.visible").click();
      cy.get(
         '[data-cy="menu-item Add Assets Log fd0bbb13-cab0-4393-a29b-34b1cd466873 16966204-acbb-4a44-97a4-c1eb05d836a3"]'
      ).should("be.visible").click();
      cy.get('[class="webix_progress_state wxi-sync webix_spin"]')
         .should("not.be.visible");
      cy.get(
         '[data-cy="LongText Asset Description f2b65cf6-5f67-4aa2-83e6-350cf0705ff1 7a3b8980-e30d-4135-8b01-a4e06fcac9f2"]'
      )
         .scrollIntoView()
         .should("exist")
         .type("Please work", { force: true })
         .clear()
         .type(text);
      cy.get('[data-cy="button save 7a3b8980-e30d-4135-8b01-a4e06fcac9f2"]')
         .should("exist")
         .scrollIntoView()
         .click();
      cy.get(
         '[data-cy="LongText Asset Description f2b65cf6-5f67-4aa2-83e6-350cf0705ff1 7a3b8980-e30d-4135-8b01-a4e06fcac9f2"]'
      ).should("exist");
      cy.get(
         '[data-cy="ABViewGrid_11c6e28c-4503-41c2-a6ce-93098212568d_datatable"]'
      ).contains("Hello World");
   });
   it("Test contactingAgencies", () => {
      saveAndCheck("logs", "contactingAgencies", "name");
   });

   // Medical //
   it("Test vaccination", () => {
      saveAndCheck("medical", "vaccination", "otherVacc");
   });
   it("Test healthInfo", () => {
      saveAndCheck("medical", "healthInfo", "injections");
      // cy.get(".webix_warn")
      //    .find(".webix_button")
      //    .first() //Two buttons are in the dom need to get the first
      //    .should("be.visible")
      //    .click();
      // // cy.window().then((win) => {
      // //    return win
      // //       .$$("ABViewGrid_cc56027a-81f0-4da0-8d56-eb7c91bee1a5_datatable")
      // //       .scrollTo(1200, 0);
      // // });
      // cy.get(cyInterfaceCHILD.page.medical.page.healthInfo.grid)
      //    .contains(text)
      // checkForm("medical", "healthInfo", "injections");
   });
   it("Test medicalRecord", () => {
      saveAndCheck("medical", "medicalRecord", "symptoms");
   });
   it("Test growthLog", () => {
      save("medical", "growthLog", "note");
      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .click({ multiple: true, force: true });
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_11ae8a02-ba79-4e33-bf1f-dd3475e0ee2c_datatable")
            .scrollTo(1200, 0);
      });
      cy.get(cyInterfaceCHILD.page.medical.page.growthLog.grid).contains(text);
      checkForm("medical", "growthLog", "note");
   });
   it("Test developmentLog", () => {
      save("medical", "developmentLog", "notes");
      cy.get(".webix_warn")
         .find(".webix_button")
         .should("be.visible")
         .click({ multiple: true, force: true });
      cy.window().then((win) => {
         return win
            .$$("ABViewGrid_c1304fbf-e972-4a14-b73a-976fca4823f1_datatable")
            .scrollTo(1200, 0);
      });
      cy.get(cyInterfaceCHILD.page.medical.page.developmentLog.grid).contains(
         text
      );
      checkForm("medical", "developmentLog", "notes");
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
      // eslint-disable-next-line prettier/prettier
      cy.get('[class="webix_progress_state wxi-sync webix_spin"]')
         // eslint-disable-next-line prettier/prettier
         .should("not.be.visible");
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.fields[field])
         .scrollIntoView()
         .should("exist")
         .type("Please work")
         .clear()
         .type(text);
      cy.get(cyInterfaceCHILD.page[parent].page[child].form.add.button.save)
         // .scrollIntoView()
         .should("exist")
         .scrollIntoView()
         .click({ force: true });
      cy.get(
         cyInterfaceCHILD.page[parent].page[child].form.add.button.save
      ).should("not.exist"); // wait until popup goes away
      cy.get(".webix_warn")
         .find(".webix_button")
         .filter(":visible")
         .click({ multiple: true, force: true });
      cy.get(cyInterfaceCHILD.page[parent].page[child].grid).contains(text);
      checkForm(parent, child, field);
   });
   it("Test socialWelfare", () => {
      saveAndCheck("socialWork", "socialWelfare", "history");
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