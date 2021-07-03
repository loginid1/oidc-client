"use strict;"

const crypto = require("crypto");
const rs = require("jsrsasign");

const clientId = process.env.PRIVATE_CLIENT_ID;
const privKey = process.env.PRIVATE_CLIENT_KEY;
const baseUrl = `${process.env.BASE_URL}/private`;
const authUrl = `${process.env.LOGIN_URL}/oauth2/auth`;
const tokenUrl = `${process.env.LOGIN_URL}/oauth2/token`;

function makeJwt () {

}

async function privateClientHandler (req, res) {
    const code = req.query.code;
    const error = req.query.error;
    const error_description = req.query.error_description;

    if (code) {
        // TODO: check state
        // TODO: construct client assertion JWT
        // TODO: call token endpoint
        // TODO: parse id token
        // TODO: check nonce
        res.render("private_code", {
            code,
        });
        return;
    }

    if (error) {
        // Convert error code to title
        const title = error.replace("_", " ");
        res.render("private_error", { title, error, error_description });
        return;
    }

    // Construct request params
    // TODO: set cookie for state, store nonce
    const state = crypto.randomBytes(24).toString('base64url');
    const nonce = crypto.randomBytes(24).toString('base64url');
    const scope = "openid";

    // TODO: render start page
    res.render("private_start", {
        authUrl,
        baseUrl,
        clientId,
        state,
        nonce,
        scope,
    });
}

module.exports = {
    privateClientHandler,
};
