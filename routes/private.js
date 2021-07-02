const clientId = process.env.PRIVATE_CLIENT_ID;
const privKey = process.env.PRIVATE_CLIENT_KEY;
const baseUrl = `${process.env.BASE_URL}/private`;
const authUrl = `${process.env.LOGIN_URL}/oauth2/auth`;
const tokenUrl = `${process.env.LOGIN_URL}/oauth2/token`;

function privateClientHandler (req, res) {
    if (req.query.code) {
        // TODO: construct client assertion JWT
        // TODO: call token endpoint
        // TODO: parse id token
        // TODO: render success page
        return;
    }

    if (req.query.error) {
        // TODO: get error and description
        // TODO: convert error code to title
        // TODO: render error page
        return;
    }

    // TODO: create new state
    // TODO: construct request URL
    // TODO: render start page
}

exports = {
    privateClientHandler,
};
