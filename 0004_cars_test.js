import * as Common from "../../../../setup/common.js";

import cyInterfaceCARS from "./test_setup/cy_interface/interface.js";

const navigators = "[data-cy=\"portal_work_menu_sidebar\"]";
const sql = ['db_init'];

describe("Adding New Child:", () => {
    before(() => {
        Common.ResetDB(cy);
        Common.AuthLogin(cy);
        cy.request("POST", "/test/import", {
            file: `imports/test_cars/test_import/module.json`,
         });
        cy.exec(`bash ./cypress/integration/test_cars/test_setup/sql/init.sh ${sql.join(' ')}`);
    });

    beforeEach(() => {
        cy.visit("/").wait(1500);
        cy.get(navigators).click();
        cy.get(cyInterfaceCARS.navigator).click();
    });

    it("Adding New Children", () => {

        //arrange
        const child = {
            no: '1',
            firstName: "Satoshi",
            lastName: "Nakamoto",
            nickname: "Sato",
            profilePhoto: "",
            birthday: "05/04/1975",
            gender: "Male",
            religion: "Other",
            race: "Human",
            nationality: "Japanese",
            home: "Home 1",
            typeRecieved: "Permanent",
            timeRecievedFor: "05/04/1975 17:00 PM",
            relatives: "Taylor Swift",
            carsProject: "CARS Project 1",
        };

        //act
        cy.get(cyInterfaceCARS.tab.socialWorker).click();
        cy.get(cyInterfaceCARS.page.socialWorker.tab.children).click();
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.button.addChildren).click();
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field.no).type(child.no);
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field.firstName).type(child.firstName);
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field.lastName).type(child.lastName);
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field.nickname).type(child.nickname);
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field.birthday).type(child.birthday);
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field.birthday).click();
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field.gender).click();
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.option.gender[0]).click();
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field.religion).click();
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.option.religion[3]).click();
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field.race).type(child.race);
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field.nationality).type(child.nationality);
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field.home).click();
        cy.get('.selectivity-result-item').click();
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field.typeRecieved).click();
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.option.typeRecieved[0]).click();
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field.timeRecievedfor).type(child.timeRecievedFor);
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field.relatives).click();
        cy.get('.selectivity-result-item').click();
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.field.carsProject).click();
        cy.get('.selectivity-result-item').click();
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.form.addChildren.button.save).click()
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.child.page.basicInfo.page.basicInfo.field.fitstName, { timeout: 30000 });
        cy.get('.ab-menu-left .webix_list_item').click();

        //assert
        cy.get(cyInterfaceCARS.page.socialWorker.page.children.view.children).should(dat =>{
            expect(dat.text().includes(`Registration number (TH): ${child.no}`) ? child.no: "", "Registration number").to.eq(child.no);
            expect(dat.text().includes(`${child.firstName}`) ? child.firstName: "", "First Name").to.eq(child.firstName);
            expect(dat.text().includes(`${child.lastName}`) ? child.lastName: "", "Last Name").to.eq(child.lastName);
            expect(dat.text().includes(`(${child.nickname})`) ? child.nickname: "", "Nickname").to.eq(child.nickname);
            expect(dat.text().includes(`${child.home}`) ? child.home: "", "Home").to.eq(child.home);
            expect(dat.text().includes(`${child.birthday}`) ? child.birthday: "", "Birthday").to.eq(child.birthday);
        });
    });
});