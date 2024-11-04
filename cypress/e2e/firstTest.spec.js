/// <reference types="cypress" />

const { Input } = require("@angular/core")

// const { text } = require("stream/consumers")

describe('First test suit', () => {
    it('first test', () => {

        // navigate to the web page (http://localhost:4200/pages/forms/layouts):
        cy.visit('/')
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        // How to find an element: 
        // 1. by Tag name
        cy.get('input')

        // 2. by ID
        cy.get('#inputEmail1')

        // 3. by Class value
        cy.get('.input-full-width')

        // 4. by attribute name
        cy.get('[fullwidth]')

        // 5. by Attribute and Value
        cy.get('[placeholder="Email"]')

        // 6. by entire class value
        cy.get('[class="input-full-width size-medium shape-rectangle"]')

        // 7. by two attributes
        cy.get('[placeholder="Email"][fullwidth]')

        // 8. by tag, attrubute, id, class
        cy.get('input[placeholder="Email"]#inputEmail1.input-full-width')

        // 9. by cypress test ID (jei turime priėjimą prie sourcecode, tai code'e galime pridėti pvz. tokį atributą):
        cy.get('[data-cy="imputEmail1"]')
    })

    it('second test', () => {
        cy.visit('/');
        cy.contains('Forms').click();
        cy.contains('Form Layouts').click();

        // Main methods:
        // 1. get() - find elements on the page by locator globally
        // 2. find() - find child elements by locator
        // 3. contains() - find element by HTML text, by text and by locator

        cy.contains('Sign in');
        cy.contains('[status="warning"]', 'Sign in');
        // cy.contains('nb-card', 'Horizontal form').find('button') // element is find in the form 'Horizontal form' by html attribute 'button'
        // cy.contains('nb-card', 'Horizontal form').contains('Sign in') // element is find by the parent element 'Horizontal form' and then by the child element 'Sign in'
        // cy.contains('nb-card', 'Horizontal form').get('button') // vietoj find() metodo panaudojam get() ir matom, kad nesvarbu koks atributas buvo prieš tai nurodytas, get() metodas vistiek randa visus buttonus puslapyje.

        // //cypress chains and DOM
        cy.get('#inputEmail3')
            .parents('form').find('button')
            .should('contain', 'Sign in')
            .parents('form')
            .find('nb-checkbox')
            .click();
    })

    it('save subject of the command', () => {
        cy.visit('/')
        cy.contains('Forms').click();
        cy.contains('Form Layouts').click();

        cy.contains('nb-card', 'Using the Grid')
            .find('[for="inputEmail1"]')
            .should('contain', 'Email');
        cy.contains('nb-card', 'Using the Grid').find('[for="inputPassword2"]').should('contain', 'Password')

        // CAN NOT DO LIKE THIS - cypress cannot find the element 'Password':
        // const usingTheGrid = cy.contains('nb-card', 'Using the Grid')
        // usingTheGrid.find('[for="inputEmail1"]').should('contain', 'Email')
        // usingTheGrid.find('[for="inputPassword2"]').should('contain', 'Password')

        // 1 Saving subject by the Cypress Alias
        cy.contains('nb-card', 'Using the Grid').as('usingTheGrid')
        cy.get('@usingTheGrid').find('[for="inputEmail1"]').should('contain', 'Email')
        cy.get('@usingTheGrid').find('[for="inputPassword2"]').should('contain', 'Password')

        // 2 Saving subject by the Cypress then() methods
        cy.contains('nb-card', 'Using the Grid').then(usingTheGridForm => {
            cy.wrap(usingTheGridForm).find('[for="inputEmail1"]').should('contain', 'Email')
            cy.wrap(usingTheGridForm).find('[for="inputPassword2"]').should('contain', 'Password')
        })

    })
    it('extract text values', () => {
        cy.visit('/');
        cy.contains('Forms').click()
        cy.contains('Form Layouts').click()

        //1 Extracting text values
        cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address');

        //2
        cy.get('[for="exampleInputEmail1"]').then(label => {
            const labelText = label.text();
            expect(labelText).to.equal('Email address');
            cy.wrap(labelText).should('contain', 'Email address');
        });

        // //3
        cy.get('[for="exampleInputEmail1"]').invoke('text').then(text => {
            expect(text).to.equal('Email address')
        })
        cy.get('[for="exampleInputEmail1"]').invoke('text').as('labelText').should('contain', 'Email address')

        //4 
        cy.get('[for="exampleInputEmail1"]').invoke('attr', 'class').then(classValue => {
            expect(classValue).to.equal('label')
        })

        //5 Invoke HTML properties (inspect the page and open the tab "Properties") - checking that the text "test@test.com" exists in input field:
        cy.get('#exampleInputEmail1').type('test@test.com');
        cy.get('#exampleInputEmail1').invoke('prop', 'value').should('contain', 'test@test.com').then(property => {
            expect(property).to.equal('test@test.com');
        })
    });
    it('radio buttons', () => {
        cy.visit('/');
        cy.contains('Forms').click();
        cy.contains('Form Layouts').click();

        cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then(radioButtons => {
            //cy.wrap(radioButtons).eq(0).check() //check the first radio button in the form, its index is 0.
            cy.wrap(radioButtons).eq(0).check({ force: true }).should('be.checked')  //cypress is not able to find the radio button and click it, because it has the class 'visually-hidden', so we use the 'force'. 
            cy.wrap(radioButtons).eq(1).check({ force: true }) //select the second radio button
            cy.wrap(radioButtons).eq(0).should('not.be.checked') // we expect the the first radio button is deselected and should not be checked
            cy.wrap(radioButtons).eq(2).should('be.disabled') //the last radio button should be disabled.
        });

    });

    it('checkboxes', () => {
        cy.visit('/');
        cy.contains('Modal & Overlays').click();
        cy.contains('Toastr').click();

        //cy.get('[type="checkbox"]').check({force: true})
        cy.get('[type="checkbox"]').eq(0).click({ force: true }) //this does not check the checkbox status
        cy.get('[type="checkbox"]').eq(1).check({ force: true }) //
    });

    it('Date picker', () => {
        cy.visit('/');
        cy.contains('Forms').click();
        cy.contains('Datepicker').click();

        //2.1. Create a new variable and create a date object (more info google -> JS date -> Mozilla Developer):
        let date = new Date();
        //2.2. I want to select the day wich is 5 days from today, so call the object:
        date.setDate(date.getDate() + 100);
        // console.log(date) checking how the date is printed in console
        //2.2. new variable for date wich will be as a selector in the calander
        let futureDay = date.getDate();
        //26 pamoka "Web date picker (part2)"
        //3. susikuriam kintamaji kuriame suagosime menesio pavadinima:
        let futureMonth = date.toLocaleDateString('en-US', { month: 'short' })
        let futureYear = date.getFullYear()
        //2.3. new variable for an expected result:
        let dateToAssert = `${futureMonth} ${futureDay}, ${futureYear}`

        // cy.contains('nb-card', 'Common Datepicker').find('input').then( input => {
        //     cy.wrap(input).click(); // Date Picker is opened
        //     //1. select date in current mounth:
        //     cy.get('.day-cell').not('.bounding-month').contains('23').click();
        //     //1.1. check that the date is selected successfully:
        //     cy.wrap(input).invoke('prop', 'value').should('contain', 'Oct 23, 2024');
        //     //2. Use date object to get the date:
        cy.contains('nb-card', 'Common Datepicker').find('input').then(input => {
            cy.wrap(input).click();
            //3.1. select the date:
            //3.1.1. create a recursive function, it is a workaround for cypress to run the loop until the correct date will be selected:
            function selectDayFromCurrent() {
                cy.get('nb-calendar-navigation').invoke('attr', 'ng-reflect-date').then(dateAttribute => {
                    if (!dateAttribute.includes(futureMonth) || !dateAttribute.includes(futureYear)) {
                        cy.get('[data-name="chevron-right"]').click();
                        selectDayFromCurrent();
                    } else {
                        cy.get('.day-cell').not('.bounding-month').contains(futureDay).click();
                    }
                })
            }
            selectDayFromCurrent();
            cy.wrap(input).invoke('prop', 'value').should('contain', dateToAssert);
            cy.wrap(input).should('have.value', dateToAssert);
        })
    })

    it('Lists and Dropdowns', () => {
        cy.visit('/');
        // 1. select the value from the drop down list:
        cy.get('nav nb-select').click();
        cy.get('.options-list').contains('Dark').click();
        cy.get('nav nb-select').should('contain', 'Dark');

        // 2. select the value from the dorpdown list and open/close the dropdown list:
        cy.get('nav nb-select').then(dropDown => {
            cy.log('Found dropdown');
            cy.wrap(dropDown).click();
            cy.get('.options-list nb-option').each((listItem, index) => {
                const itemText = listItem.text().trim();
                cy.log(`Selecting item at index ${index}; itemText: ${itemText}`);
                cy.wrap(listItem).click();
                cy.wrap(dropDown).should('contain', itemText);
                if (index < 3) {
                    cy.wrap(dropDown).click();
                }

            })

        })

    })

    it('Web Tables', () => {
        cy.visit('/');
        cy.contains('Tables & Data').click();
        cy.contains('Smart Table').click();

        // 1. Get the row by the text:
        cy.get('tbody').contains('tr', 'Larry').then(tableRow => {
            cy.wrap(tableRow).find('.nb-edit').click();
            cy.wrap(tableRow).find('[placeholder="Age"]').clear().type('35');
            cy.wrap(tableRow).find('.nb-checkmark').click();
            cy.wrap(tableRow).find('td').eq(6).should('contain', '35')
        })

        //2. Get the row by the index:
        cy.get('thead').find('.nb-plus').click();
        cy.get('thead').find('tr').eq(2).then(tableRow => {
            cy.wrap(tableRow).find('[placeholder="First Name"]').type("John");
            cy.wrap(tableRow).find('[placeholder="Last Name"]').type("Smith");
            cy.wrap(tableRow).find('.nb-checkmark').click();
        })
        // 2.1. validate values in entered new row:
        cy.get('tbody tr').first().find('td').then(tableColumns => {
            cy.wrap(tableColumns).eq(2).should('contain', 'John')
            cy.wrap(tableColumns).eq(3).should('contain', 'Smith')

        })

        //3. Get each row validation (creating a little delay "wait" for the table)
        const age = [20, 30, 40, 200] //kintamuju reiksmes, kurias tikrinam

        cy.wrap(age).each(age => {
            cy.get('thead [placeholder="Age"]').clear().type(age);
            cy.wait(500);
            cy.get('tbody tr').each(tableRow => {
                if (age == 200) {
                    cy.wrap(tableRow).should('contain', 'No data found')
                } else {
                    cy.wrap(tableRow).find('td').eq(6).should('contain', age)
                }
            })
        })
    })
    it.only('Tooltips', () => {
        cy.visit('/');
        cy.contains('Modal & Overlays').click();
        cy.contains('Tooltip').click();

        cy.contains('nb-card', 'Colored Tooltips')
        .contains('Default').click();
        cy.get('nb-tooltip').should('contain', 'This is a tooltip');
    })

    



})
