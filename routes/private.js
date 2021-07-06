"use strict;"

const crypto = require("crypto");
const fetch = require("node-fetch");
const rs = require("jsrsasign");

const clientId = process.env.PRIVATE_CLIENT_ID;
const baseUrl = `${process.env.BASE_URL}/private`;
const authUrl = `${process.env.LOGIN_URL}/oauth2/auth`;
const tokenUrl = `${process.env.LOGIN_URL}/oauth2/token`;

let privKey = null;
if (process.env.PRIVATE_CLIENT_KEY) {
    privKey = rs.KEYUTIL.getKey(process.env.PRIVATE_CLIENT_KEY);
}

function makeJwt () {
    const header = {
        "alg": "ES256",
        "typ": "JWT"
    };
    const payload = {
        "iss": clientId,
        "sub": clientId,
        "aud": tokenUrl,
        "jti": crypto.randomBytes(12).toString('base64url'),
        "exp": parseInt(new Date().valueOf() / 1000),
    };
    return rs.KJUR.jws.JWS.sign("ES256", JSON.stringify(header), JSON.stringify(payload), privKey);
}

async function parseJwt (jwt) {
    if (!jwt) {
        return {};
    }

    [headerStr, payloadStr, signature] = jwt.split(".");
    const header = JSON.parse(Buffer.from(headerStr, "base64url").toString());
    const payload = JSON.parse(Buffer.from(payloadStr, "base64url").toString());

    if (header.kid) {
        // TODO: verify sig
    }

    return { header, payload, signature };
}

async function privateClientHandler (req, res) {
    const code = req.query.code;
    let error = req.query.error;
    let error_description = req.query.error_description;

    if (code) {
        // TODO: check state

        // Construct client assertion JWT and token endpoint params
        const jwt = makeJwt();
        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("code", code);
        params.append("redirect_uri", baseUrl);
        params.append("client_id", clientId);
        params.append("client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer");
        params.append("client_assertion", jwt);
        
        // Call token endpoint
        const response = await fetch(tokenUrl, { method: "POST", body: params });
        const data = await response.json()

        if (response.ok) {
            // Parse id token
            const idToken = data.id_token || "<none>";
            const { payload } = await parseJwt(data.id_token);
            const payloadStr = payload ? JSON.stringify(payload, undefined, 2) : undefined;

            // TODO: check nonce

            res.render("private_code", {
                code,
                idToken,
                payloadStr,
            });
            return;
        }

        // Extract error from response
        error = data.error || "unknown_error";
        error_description = data.error_description || "An unknown error occured";
    }

    if (error) {
        // Convert error code to title
        let title = error.replace("_", " ");
        title = title[0].toUpperCase() + title.substr(1);
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
