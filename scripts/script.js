let username = '';



const msalConfig = {
    auth: {
        clientId: '87b255b6-7a08-4a34-861b-0700d114d35a',
        authority: 'https://login.microsoftonline.com/497c58e6-5262-40f2-a2f7-a115f562539d',
        tenantId: '497c58e6-5262-40f2-a2f7-a115f562539d',
        redirectUri: 'http://localhost:3000',
        graphUserScopes: ['user.read', 'mail.read', 'mail.send']
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false
    }
}


const msalObj = new msal.PublicClientApplication(msalConfig);

function Signout() {
    const logoutReq = {
        account: msalObj.getAccountByUsername(username)
    }
    msalObj.logoutRedirect(logoutReq);

    document.getElementById("logout").style.display = 'none';
    document.getElementById("login").style.display = 'block';

}

function Signin() {
    const loginScope = {
        scope: ['User.Read']
    }

    msalObj.loginRedirect(loginScope);
}

msalObj.handleRedirectPromise().then((tokenResponse) => {
    if (tokenResponse !== null) {
        console.log(tokenResponse);
        username = tokenResponse.account.username;
        document.getElementById("logout").style.display = 'block';
        document.getElementById("login").style.display = 'none';
    }
    else {
        selectAccount();
    }
}
).catch((error) => {
    console.error(error);
});

function selectAccount() {
    const accounts = msalObj.getAllAccounts();
    if (accounts.length === 0) {
        return;
    }
    else if (accounts.length === 1) {
        username = accounts[0].username;
        document.getElementById("logout").style.display = 'block';
        document.getElementById("login").style.display = 'none';
    } else if (accounts.length > 1) {
        document.getElementById("logout").style.display = 'block';
        document.getElementById("login").style.display = 'none';
        let htmlStr = '';
        accounts.forEach((account, index) => {
            htmlStr += `<option value="${index}">${account.username}</option>`;
        });
        htmlStr = `<select id="accountSelect">${htmlStr}</select>`;
        document.getElementById("accountList").innerHTML = htmlStr;
        document.getElementById("accountSelect").addEventListener('change', (e) => {
            username = accounts[e.target.value].username;
        });
        document.getElementById("accountSelect").selectedIndex = 0;
        document.getElementById("accountSelect").dispatchEvent(new Event('change'))
    }
}