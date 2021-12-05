const dbConnection = require('./dbModule');
const jwt = require('jsonwebtoken');

const { ACCESS_TOKEN_SECRET, COOKIE_LABEL, DB_NAME } = require('../config/app-config');

// __________ | __________ | Authorize Token Fetch | __________ | __________ \\
function authorizeToken_fetch(req, res, next) {
    if (req.cookies[COOKIE_LABEL]) {
        const authorizationToken = req.cookies[COOKIE_LABEL];
        if (authorizationToken == null) return res.json([{ "msg": "Unauthorized" }]);
        dbConnection.query(`USE ${DB_NAME}`, function (error, result) {
            if (error) {
                console.log(`F_authorizeToken: Cannot connect to ${DB_NAME}`);
                return res.json([{ "msg": "Something Went Wrong" }]);
            }
            jwt.verify(authorizationToken, ACCESS_TOKEN_SECRET, (error, user) => {
                if (error) return res.json([{ "msg": "Unauthorized" }]);
                dbConnection.query("SELECT email_id FROM user_accounts WHERE email_id = ?", [user.login_email], function (error, result) {
                    if (error) {
                        console.log("F_authorizeToken: Cannot connect to user_database");
                        return res.json([{ "msg": "Something Went Wrong" }]);
                    }
                    req.user = user;
                    next();
                });
            });
        });
    } else return res.json([{ "msg": "Unauthorized" }]);
}

// __________ | __________ | Authorize Token | __________ | __________ \\
function authorizeToken(req, res, next) {
    if (req.cookies[COOKIE_LABEL]) {
        const authorizationToken = req.cookies[COOKIE_LABEL];
        if (authorizationToken == null) return res.redirect('/');
        dbConnection.query(`USE ${DB_NAME}`, function (error, result) {
            if (error) {
                console.log(`F_authorizeToken: Cannot connect to ${DB_NAME}`);
                return res.json([{ "msg": "Something Went Wrong" }]);
            }
            jwt.verify(authorizationToken, ACCESS_TOKEN_SECRET, (error, user) => {
                if (error) return res.json([{ "msg": "Unauthorized" }]);
                dbConnection.query("SELECT email_id FROM user_accounts WHERE email_id = ?", [user.login_email], function (error, result) {
                    if (error) {
                        console.log("F_authorizeToken: Cannot select email_id from user_accounts");
                        return res.json([{ "msg": "Something Went Wrong" }]);
                    }
                    req.user = user;
                    next();
                });
            });
        });
    } else {
        return res.redirect('/');
    }
}

function enrollStatus(req, res, next) {
    const email = req.user.login_email;
    const course_title = req.params.name;
    let course_info;
    dbConnection.query(`USE ${DB_NAME}`, function (error, result) {
        if (error) {
            console.log(`F_enrollStatus: Cannot connect to ${DB_NAME}`);
            return res.json([{ "msg": "Something Went Wrong" }]);
        }
        dbConnection.query("SELECT * FROM course_info WHERE course_title = ?", [course_title], function (error, result) {
            if (error) {
                console.log("F_enrollStatus: Cannot select * from course_info");
                return res.json([{ "msg": "Something Went Wrong" }]);
            }
            if (result.length == 1) {
                course_info = result[0];
                dbConnection.query("SELECT * FROM enrollment_data WHERE email_id = ? AND course_title = ?", [email, course_title], function (error, result) {
                    if (error) {
                        console.log("F_enrollStatus: Cannot select * from enrollment_data");
                        return res.json([{ "msg": "Something Went Wrong" }]);
                    }
                    if (result.length == 1) {
                        const enrollment_data = result[0];
                        req.enrollStatus = true;
                        req.email = email;
                        req.course_info = course_info;
                        req.course_title = course_title;
                        req.course_description = course_info.course_description;
                        req.enrollment_data = enrollment_data;
                        next();
                    }
                    else {
                        req.course_info = course_info;
                        req.enrollStatus = false;
                        next();
                    }
                });
            }
            else return res.render('error_page', { error_code: '404 Page Not Found' });
        });
    });
}

module.exports = {
    authorizeToken_fetch,
    authorizeToken,
    enrollStatus,
}