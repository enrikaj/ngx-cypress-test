/// <reference types="cypress" />

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
        cy.get('[for="exampleInputEmail1"]').then( label => {
            const labelText = label.text();
            expect(labelText).to.equal('Email address');
            cy.wrap(labelText).should('contain', 'Email address');
        });

        // //3
        cy.get('[for="exampleInputEmail1"]').invoke('text').then( text => {
            expect(text).to.equal('Email address')
        })
        cy.get('[for="exampleInputEmail1"]').invoke('text').as('labelText').should('contain', 'Email address')

        //4 
        cy.get('[for="exampleInputEmail1"]').invoke('attr', 'class').then( classValue => {
            expect(classValue).to.equal('label')
        })

        //5 Invoke HTML properties (inspect the page and open the tab "Properties") - checking that the text "test@test.com" exists in input field:
        cy.get('#exampleInputEmail1').type('test@test.com');
        cy.get('#exampleInputEmail1').invoke('prop', 'value').should('contain', 'test@test.com').then( property => {
            expect(property).to.equal('test@test.com');
        })
    })
    it.only('radio buttons', () => {
        cy.visit('/');
        cy.contains('Forms').click();
        cy.contains('Form Layouts').click();

        cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then( radioButtons => {
            //cy.wrap(radioButtons).eq(0).check() //check the first radio button in the form, its index is 0.
            cy.wrap(radioButtons).eq(0).check({force: true}).should('be.checked')  //cypress is not able to find the radio button and click it, because it has the class 'visually-hidden', so we use the 'force'. 
            cy.wrap(radioButtons).eq(1).check({force: true}) //select the second radio button
            cy.wrap(radioButtons).eq(0).should('not.be.checked') // we expect the the first radio button is deselected and should not be checked
            cy.wrap(radioButtons).eq(2).should('be.disabled') //the last radio button should be disabled.
        })

    })



})
