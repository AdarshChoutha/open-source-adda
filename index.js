const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const { PORT, COOKIE_LABEL, DB_NAME } = require('./src/config/app-config');
const dbConnection = require('./src/controllers/dbModule');
const course_route = require('./src/routes/course_route');
const { authorizeToken_fetch } = require('./src/controllers/middleware_function');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/course', course_route);

app.get('/', (req, res) => {
    dbConnection.query(`USE ${DB_NAME}`, function (error, result) {
        if (error) {
            console.error(error);
            console.log(`/: Cannot connect to ${DB_NAME}`);
            return res.json([{ "msg": "Something Went Wrong" }]);
        }
        dbConnection.query("SELECT * FROM course_info", function (error, result) {
            if (error) {
                console.log("/: Cannot select * from course_info");
                return res.json([{ "msg": "Something Went Wrong" }]);
            }
            const course_heading = 'our popular courses';
            const courses = result;
            let courses_rating_data = [];
            if (result.length == 0) return res.render('index', { course_heading, courses, courses_rating_data });
            for (let k = 0; k < courses.length; k++) {
                let course = courses[k];
                let course_title = course.course_title;
                dbConnection.query("SELECT CAST(AVG(rating_given) AS decimal(2,1)) AS rating_given FROM enrollment_data WHERE rating_given != 0 AND course_title = ?", [course_title], function (error, result) {
                    if (error) {
                        console.log("/: Cannot select from course_info", error);
                        return res.json([{ "msg": "Something Went Wrong" }]);
                    }
                    let rating_given = 0;
                    if (result[0]) rating_given = result[0].rating_given;
                    courses_rating_data.push({ course_title, rating_given });
                    if (k == courses.length - 1) return res.render('index', { course_heading, courses, courses_rating_data });
                });
            }
        });
    });
});

app.get('/account', authorizeToken_fetch, (req, res) => {
    email = req.user.login_email;
    dbConnection.query("SELECT * FROM course_info WHERE course_title IN (SELECT course_title FROM enrollment_data WHERE email_id = ?)", [email], function (error, result) {
        if (error) {
            console.log("/account: Cannot select enrolled_course from course_info");
            return res.json([{ "msg": "Something Went Wrong" }]);
        }
        const course_heading = 'enrolled courses';
        const enrolled_courses = result;
        let courses_rating_data = [];
        let enrollment_data_array = [];
        if (result.length == 0) return res.render('account', { email, course_heading, enrolled_courses, courses_rating_data, enrollment_data_array })
        for (let k = 0; k < enrolled_courses.length; k++) {
            let course = enrolled_courses[k];
            let course_title = course.course_title;
            dbConnection.query("SELECT CAST(AVG(rating_given) AS decimal(2,1)) AS rating_given FROM enrollment_data WHERE rating_given != 0 AND course_title = ?", [course_title], function (error, result) {
                if (error) {
                    console.log("/: Cannot select from course_info", error);
                    return res.json([{ "msg": "Something Went Wrong" }]);
                }
                let rating_given = 0;
                if (result[0]) rating_given = result[0].rating_given;
                courses_rating_data.push({ course_title, rating_given });

                if (k == enrolled_courses.length - 1) {
                    dbConnection.query("SELECT * FROM enrollment_data WHERE email_id = ?", [email], function (error, result) {
                        if (error) {
                            console.log("/account: Cannot select from enrollment_data");
                            return res.json([{ "msg": "Something Went Wrong" }]);
                        }
                        if (result.length > 0) enrollment_data_array = result;
                        return res.render('account', { email, course_heading, enrolled_courses, courses_rating_data, enrollment_data_array });
                    });
                }
            });
        }
    });
});

// __________ | __________ | LogIN | __________ | __________ \\
app.post('/login', [
    body('login_email').isEmail().normalizeEmail(),
    body('login_password').isStrongPassword()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json(errors.array());
    else {
        dbConnection.query(`USE ${DB_NAME}`, function (error, result) {
            if (error) {
                console.log(`/login: Cannot connect to ${DB_NAME}`);
                return res.json([{ "msg": "Something Went Wrong" }]);
            }
            dbConnection.query("SELECT email_id FROM user_accounts WHERE email_id = ?", [req.body.login_email], function (error, result) {
                if (error) {
                    console.log("/login: Cannot select email_id from user_accounts");
                    return res.json([{ "msg": "Something Went Wrong" }]);
                }
                if (result[0]) {
                    bcrypt.hash(req.body.login_password, 10, function (error, hash) {
                        if (error) {
                            console.log("/login: Cannot hash password");
                            return res.json([{ "msg": "Something Went Wrong" }]);
                        }
                        this.hash = hash;
                        dbConnection.query("SELECT user_password FROM user_accounts WHERE email_id = ?", [req.body.login_email], function (error, result) {
                            if (error) {
                                console.log("/login: Cannot select user_password from user_accounts");
                                return res.json([{ "msg": "Something Went Wrong" }]);
                            }
                            bcrypt.compare(req.body.login_password, result[0].user_password, function (error, isMatch) {
                                if (error) {
                                    console.log("/login: Cannot compare passwords");
                                    return res.json([{ "msg": "Something Went Wrong" }]);
                                }
                                if (isMatch) {
                                    const user = { "login_email": req.body.login_email };
                                    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
                                        expiresIn: '4d'
                                    });
                                    res.cookie(COOKIE_LABEL, accessToken, {
                                        expires: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
                                        httpOnly: true
                                    });
                                    return res.json([{ "msg": "LogIn Successful" }]);
                                }
                                else return res.json([{ "msg": "Password Doesn't Match" }]);
                            });
                        });
                    });
                }
                else {
                    return res.json([{ "msg": "Email Doesn't Exist" }]);
                }
            });
        });
    }
});

// __________ | __________ | LogIN Account | __________ | __________ \\
app.post('/login_account', authorizeToken_fetch, (req, res) => {
    email = req.user.login_email;
    return res.json([{ email, "msg": "Authorized" }]);
});

// __________ | __________ | LogOUT | __________ | __________ \\
app.get('/logout', authorizeToken_fetch, (req, res) => {
    res.cookie(COOKIE_LABEL, "", {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    return res.redirect('/');
});

// __________ | __________ | Registration | __________ | __________ \\
// __________ | Entered Email | __________ \\
app.post('/check_registration_email_entered', [
    body('registration_email_entered').isEmail().normalizeEmail()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json(errors.array());
    else {
        dbConnection.query(`USE ${DB_NAME}`, function (error, result) {
            if (error) {
                console.log(`/check_registration_email_entered: Cannot connect to ${DB_NAME}`);
                return res.json([{ "msg": "Something Wrong" }]);
            }
            dbConnection.query("SELECT email_id FROM user_accounts WHERE email_id = ?", [req.body.registration_email_entered], function (error, result) {
                if (error) {
                    console.log("/check_registration_email_entered: Cannot select email_id from user_accounts");
                    return res.json([{ "msg": "Something Went Wrong" }]);
                }
                if (result[0]) return res.json([{ "msg": "Email Already Exists" }]);
                else return res.json([{ "msg": "Valid value" }]);
            });
        });
    }
});

// __________ | Entered Password Email | __________ \\
app.post('/check_registration_password_entered', [
    body('registration_password_entered').isStrongPassword()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json(errors.array());
    else return res.json([{ "msg": "Valid value" }]);
});

// __________ | Register Email & Password | __________ \\
app.post('/register', [
    body('registration_email').isEmail().normalizeEmail(),
    body('registration_password').isStrongPassword()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.json(errors.array());
    else {
        dbConnection.query(`USE ${DB_NAME}`, function (error, result) {
            if (error) {
                console.log(`/register: Cannot connect to ${DB_NAME}`);
                return res.json([{ "msg": "Something Went Wrong" }]);
            }
            dbConnection.query("SELECT email_id FROM user_accounts WHERE email_id = ?", [req.body.registration_email], function (error, result) {
                if (error) {
                    console.log("/register: Cannot select email_id from user_accounts");
                    return res.json([{ "msg": "Something Went Wrong" }]);
                }
                if (result[0]) return res.json([{ "msg": "Email Already Exists" }]);
                else {
                    //Password
                    bcrypt.hash(req.body.registration_password, 10, function (error, hash) {
                        if (error) {
                            console.log("/register: Cannot hash password");
                            return res.json([{ "msg": "Something Went Wrong" }]);
                        }
                        this.hash = hash;
                        dbConnection.query("INSERT INTO user_accounts(email_id, user_password) VALUES (?,?)", [req.body.registration_email, this.hash], function (error, result) {
                            if (error) {
                                console.log("/register: Cannot insert email_id, user_password into user_accounts");
                                return res.json([{ "msg": "Something Went Wrong" }]);
                            }
                            dbConnection.query("SELECT user_password FROM user_accounts WHERE email_id = ?", [req.body.registration_email], function (error, result) {
                                if (error) {
                                    console.log("/register: Cannot select password from user_accounts");
                                    return res.json([{ "msg": "Something Went Wrong" }]);
                                }
                                bcrypt.compare(req.body.registration_password, result[0].user_password, function (error, isMatch) {
                                    if (error) {
                                        console.log("/register: Cannot compare passwords");
                                        return res.json([{ "msg": "Something Went Wrong" }]);
                                    }
                                    if (!isMatch) {
                                        dbConnection.query("SELECT user_id FROM user_accounts WHERE email_id = ?", [req.body.registration_email], function (error, result) {
                                            if (error) {
                                                console.log("/register: Cannot select user_id from user_accounts");
                                                return res.json([{ "msg": "Something Went Wrong" }]);
                                            }
                                            dbConnection.query("DELETE FROM user_accounts WHERE email_id = ?", [req.body.registration_email], function (error, result) {
                                                if (error) {
                                                    console.log("/register: Cannot delete from user_accounts");
                                                    return res.json([{ "msg": "Something Went Wrong" }]);
                                                }
                                            });
                                            dbConnection.query("ALTER TABLE user_accounts AUTO_INCREMENT = ?", [result[0].id], function (error, result) {
                                                if (error) {
                                                    console.log("/register: Cannot alter user_accounts");
                                                    return res.json([{ "msg": "Something Went Wrong" }]);
                                                }
                                                return res.json([{ "msg": "Registration Failure" }]);
                                            });
                                        });
                                    }
                                    else return res.json([{ "msg": "Registration Successful" }]);
                                });
                            });
                        });
                    });
                }
            });
        });
    }
});

app.get('/*', (req, res) => {
    res.render('error_page', { error_code: '404 Page Not Found' });
});
app.post('/*', (req, res) => {
    res.render('error_page', { error_code: '404 Page Not Found' });
});
app.put('/*', (req, res) => {
    res.render('error_page', { error_code: '404 Page Not Found' });
});
app.delete('/*', (req, res) => {
    res.render('error_page', { error_code: '404 Page Not Found' });
});

app.listen(PORT, (error) => {
    if (error) console.error(error);
    else console.log(`Listening to port ${PORT}`);
});
