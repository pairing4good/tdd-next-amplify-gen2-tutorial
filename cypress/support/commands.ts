import 'cypress-localstorage-commands';
import { Amplify } from "aws-amplify";
import { fetchAuthSession, signIn } from "aws-amplify/auth";
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);


Cypress.Commands.add('signIn', () => { 
    const username = "pairing4good@gmail.com";
    const password = "Pairing4good@"
    const userPoolClientId = outputs.auth.user_pool_client_id;
    const keyPrefix = `CognitoIdentityServiceProvider.${userPoolClientId}`;
    
    cy.wrap(signIn({ username, password}))
        .then((_signInOutput) => fetchAuthSession())
        .then((authSession) => {
            const idToken = authSession.tokens?.idToken?.toString() || ''
            const accessToken = authSession.tokens?.accessToken.toString() || ''
            
            cy.setLocalStorage(`${keyPrefix}.${username}.accessToken`, accessToken);
            cy.setLocalStorage(`${keyPrefix}.${username}.idToken`, idToken);
            cy.setLocalStorage(`CognitoIdentityServiceProvider.${userPoolClientId}.LastAuthUser`, username);
            cy.saveLocalStorage();
        });
 })

declare global {
  namespace Cypress {
    interface Chainable {
        signIn(): Chainable<void>
    }
  }
}
