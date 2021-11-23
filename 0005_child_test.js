// common setup
const cyInterfaceCommon = {
    button: {
        menu: "[data-cy=\"portal_work_menu_sidebar\"]"
    }
}
const module = ["cars"];

const importModule = (moduleName) => {

  cy.request("POST", "/test/import", {
    file: `imports/test_${moduleName.toLowerCase()}/test_import/module.json`
  });

  //fix file import
  const commands = ["reset", "import-files"];
  cy.exec(`bash ${path.join("cypress", "integration" ,`test_${moduleName.toLowerCase()}`, "test_setup", "commands", "file_manager.sh")} ${commands.join(' ')}`);
}

const sqlManager = (moduleName, sqlFile) => {
  cy.exec(`bash -c "ls ${path.join("cypress", "integration", `test_${moduleName.toLowerCase()}`, "test_setup", "sql")}"`).then((files) => {
    const sqlFiles = files.stdout.split(/[\s\n\\]+/).filter(e => e.includes(".sql"));
    cy.exec(`bash ${path.join("cypress", "integration", `test_${moduleName.toLowerCase()}`, "test_setup", "commands", "sql_manager.sh")} ${sqlFiles[sqlFiles.indexOf(sqlFile)]}`);
  });
}

// =====================================================================================================================

import * as Common from "../../../../setup/common.js";


import cyInterfaceCARS from "./test_setup/cy_interface/interface.json";
import cyInterfaceCHILD from "./test_setup/cy_interface/interface_child.json";
import example from "./test_example/example.json";
import path from "path";


// CARS setup
const moduleCARS = module[module.indexOf("cars")];

const navigator = () => {
    cy.get(cyInterfaceCommon.button.menu).click();
    cy.get(cyInterfaceCARS.navigator).click();
}

const childVisit = () =>{
    cy.get(cyInterfaceCommon.button.menu, { timeout: 5000 }).click();
    cy.get(cyInterfaceCARS.navigator).click();
    cy.get(cyInterfaceCARS.tab.socialWorker).click();
    cy.get(cyInterfaceCARS.page.socialWorker.tab.children).click();
    cy.get(cyInterfaceCARS.page.socialWorker.page.children.existingChildButton[0]).click({ force: true }).wait(500);
    // cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.children.container)
    //     .find(cyInterfaceCARS.page.socialWorker.page.children.view.children.index.replace("[index]", (5 + indexOfChild).toString()))
    //     .invoke("attr", "class")
    //     .then((data) => {
    //         cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.position.replace("[childID]", data.split(' ')[3].replace("ab-record-", ''))).click();
    //     });
};

// // End to End Testing
describe("Test Child:", () => {
    before(() =>{
        Common.ResetDB(cy);
        cy.wait(1500);
        Common.AuthLogin(cy);
        importModule(moduleCARS);
        cy.wait(1500);
        sqlManager(moduleCARS, "init_db_for_updating_a_childs_data.sql");
    });

    beforeEach(() => {
        Common.AuthLogin(cy);
        // sqlManager(moduleCARS,"reset-db");
        cy.wait(1500);
        cy.visit("/").wait(2500);
        childVisit();
    });

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

    //     //arrange
    //     const childrenIndex = 0;
    //     const child = example.children[childrenIndex];

    //     //act
    //     // create child

    //     //assert
    //     // Basic info intact

    //     //assert
    //     // admit info generated

    //     //assert
    //     // prelim health exam generated
    //     // physcial details generated
    //     // vaccination generated (and connected)
    //     // growth log generated
    //     // asset log generated


    // });

    it("Test editing a child", () => {

        //arrange
        const childrenIndex = 0;
        const child = example.children[childrenIndex];

        //act
        cy.get(cyInterfaceCHILD.page.basicInfo.tab.files).click().wait(100)
        cy.get(cyInterfaceCHILD.page.basicInfo.page.files.button.addFile).click().wait(100)
        cy.get(cyInterfaceCHILD.page.basicInfo.page.files.form.label).type("Hello World")
        // TODO add file
        cy.get(cyInterfaceCHILD.page.basicInfo.page.files.form.button.save).click().wait(500)

        cy.get(".webix_warn")
          .find(".webix_button")
          .click().wait(500)

        // should contain new data in grid
        cy.get(cyInterfaceCHILD.page.basicInfo.page.files.grid).should((data) => {
          expect(data.text().includes("Hello World") ? "Hello World": "", "File Name").to.eq("Hello World");
        });

        // Data needs to already exist
        cy.get(cyInterfaceCHILD.page.basicInfo.tab.admitInfo).click().wait(100)
        cy.get(cyInterfaceCHILD.page.basicInfo.page.admitInfo.button.editAdmitInfo).click().wait(100)
        //
        cy.get(cyInterfaceCHILD.page.basicInfo.page.admitInfo.form.child).should((data) => {
          expect(data.text().includes("1 NakamotoSatoshi") ? "1 NakamotoSatoshi": "", "ID Number").to.eq("1 NakamotoSatoshi");
        });

        //act
        //Add parent
        //assert
        //parent in grid

        //act
        //add family memeber
        //assert
        // family member in grid

        //act
        //assert

        //act
        //assert

        //assert

    });
    it("Test education submitting", () => {

        //arrange
        const childrenIndex = 0;
        const child = example.children[childrenIndex];
        const text = 'Hello World';

        cy.get(cyInterfaceCHILD.tab.education).click().wait(250)
        cy.get(cyInterfaceCHILD.page.education.tab.schoolRecords).click().wait(100)
        cy.get(cyInterfaceCHILD.page.education.page.schoolRecords.button.add).click().wait(500)
        cy.get(cyInterfaceCHILD.page.education.page.schoolRecords.form.add.fields.subject).type(text)
        cy.get(cyInterfaceCHILD.page.education.page.schoolRecords.form.add.button.save).click().wait(250)
        cy.get(".webix_warn")
        .find(".webix_button").click().wait(500)
        //cy.get(cyInterfaceCHILD.page.education.page.schoolRecords.grid)
        // assert


         cy.get(cyInterfaceCHILD.page.education.tab.generalCourses).click().wait(100)
        cy.get(cyInterfaceCHILD.page.education.page.generalCourses.button.add).click().wait(500)
        cy.get(cyInterfaceCHILD.page.education.page.generalCourses.form.add.fields.school).type(text)
        cy.get(cyInterfaceCHILD.page.education.page.generalCourses.form.add.button.save).click().wait(250)
        cy.get(".webix_warn")
        .find(".webix_button").click().wait(500)
        //cy.get(cyInterfaceCHILD.page.education.page.schoolRecords.grid)
        // assert

         cy.get(cyInterfaceCHILD.page.education.tab.careerInfo).click().wait(100)
        cy.get(cyInterfaceCHILD.page.education.page.careerInfo.button.add).click().wait(500)
        cy.get(cyInterfaceCHILD.page.education.page.careerInfo.form.add.fields.workPlace).type(text)
        cy.get(cyInterfaceCHILD.page.education.page.careerInfo.form.add.button.save).click().wait(250)
        cy.get(".webix_warn")
        .find(".webix_button").click().wait(500)
        //cy.get(cyInterfaceCHILD.page.education.page.schoolRecords.grid)
        // assert

         cy.get(cyInterfaceCHILD.page.education.tab.educationInfo).click().wait(100)
        cy.get(cyInterfaceCHILD.page.education.page.educationInfo.button.add).click().wait(500)
        cy.get(cyInterfaceCHILD.page.education.page.educationInfo.form.add.fields.school).type(text)
        cy.get(cyInterfaceCHILD.page.education.page.educationInfo.form.add.button.save).click().wait(250)
        cy.get(".webix_warn")
        .find(".webix_button").click().wait(500)
        // cy.get(cyInterfaceCHILD.page.education.page.educationInfo.grid).should((data) => {
        //   expect(data.text().includes(text) ? text: "", "hello world").to.eq(text);
        // })
        cy.get(cyInterfaceCHILD.page.education.page.educationInfo.grid).contains(text).exists();
        // assert

        // cy.get(cyInterfaceCHILD.page.education.tab.generalCourses).click().wait(100)
        // cy.get(cyInterfaceCHILD.page.education.tab.careerInfo).click().wait(100)
        // cy.get(cyInterfaceCHILD.page.education.tab.educationInfo).click().wait(100);

    });
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
});


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
