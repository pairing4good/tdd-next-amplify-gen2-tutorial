import 'cypress-localstorage-commands';
import { Amplify } from "aws-amplify";
import { fetchAuthSession, signIn } from "aws-amplify/auth";
import outputs from "../../amplify_outputs.json";

Amplify.configure(outputs);


Cypress.Commands.add('signIn', () => { 
    const username = "pairing4good@gmail.com";
    const userPoolClientId = outputs.auth.user_pool_client_id;
    signIn({username, password: "Pairing4good@"})
        .then((_signInOutput) => fetchAuthSession())
        .then((authSession) => {
            const idToken = authSession.tokens?.idToken?.toString() || ''
            const accessToken = authSession.tokens?.accessToken.toString() || ''
            const keyPrefix = `CognitoIdentityServiceProvider.${userPoolClientId}`;
            
            cy.setLocalStorage(`${keyPrefix}.${username}.accessToken`, accessToken);
            cy.setLocalStorage(`${keyPrefix}.${username}.idToken`, idToken);
            cy.setLocalStorage(`CognitoIdentityServiceProvider.${userPoolClientId}.LastAuthUser`, username);
        })
        .catch((err) => console.log(err));
    cy.saveLocalStorage();
 })

declare global {
  namespace Cypress {
    interface Chainable {
        signIn(): Chainable<void>
    }
  }
}
