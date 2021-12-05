const express = require('express');
const course_route = express.Router();
const fs = require('fs');
const path = require('path');

const dbConnection = require('../controllers/dbModule');
const { authorizeToken, enrollStatus } = require('../controllers/middleware_function');

course_route.use(express.static(path.join(__dirname, '../', 'public')))

course_route.post('/enroll/:name', [
    authorizeToken,
    enrollStatus
], (req, res) => {
    const email = req.user.login_email;
    const course_title = req.params.name;
    const enrollStatus = req.enrollStatus;
    if (enrollStatus) {
        return res.redirect(`/course/${course_title}`);
    } else {
        dbConnection.query("SELECT course_title FROM course_info WHERE course_title = ?", [course_title], (error, result) => {
            if (error) {
                console.log("/course_route/enroll/:name: Cannot select course_title from course_info");
                return res.json([{ "msg": "Something Went Wrong" }]);
            }
            if (result.length == 1) {
                dbConnection.query("SELECT course_price FROM course_info WHERE course_title = ?", [course_title], (error, result) => {
                    if (error) {
                        console.log("/course_route/enroll/:name: Cannot select course_price from course_info");
                        return res.json([{ "msg": "Something Went Wrong" }]);
                    }
                    const course_price = result[0].course_price;
                    // Go to payment page
                    // check payment status set timeout redirect
                    dbConnection.query("INSERT INTO enrollment_data (email_id, course_title, paid, completed_topics_id) VALUES (?, ?, ?, '[]')", [email, course_title, course_price], (error, result) => {
                        if (error) {
                            console.error(error);
                            console.log("/course_route/enroll/:name: Cannot insert into enrollment_data");
                            return res.json([{ "msg": "Something Went Wrong" }]);
                        }
                        return res.redirect(`/course/${course_title}`);
                        // return res.json([{ "msg": "Enroll Successful" }]);
                    });
                });
            } else return res.json([{ "msg": "Something Went Wrong" }]);
        });
    }
});

course_route.put('/:name/put_rating', [
    authorizeToken,
    enrollStatus
], (req, res) => {
    const enrollStatus = req.enrollStatus;
    const course_info = req.course_info;

    if (enrollStatus) {
        const email = req.email;
        const course_title = req.course_title;
        const course_description = req.course_description;
        const enrollment_data = req.enrollment_data;

        const rating_given = req.body.rating_given;

        if (1 <= rating_given && rating_given <= 5 && Number.isInteger(rating_given)) {
            dbConnection.query('UPDATE enrollment_data SET rating_given = ? WHERE email_id = ? AND course_title = ?', [rating_given, email, course_title], function (error, result) {
                if (error) {
                    console.log("/course_route/:name/put_rating: Cannot update enrollment_data set rating_given");
                    return res.json([{ "msg": "Something Went Wrong" }]);
                }
                return res.sendStatus(200);
            });
        } else return res.json([{ "msg": "Something Went Wrong" }]);
    } else {
        // PLEASE ENROLL TO CONTINUE PAGE
        return res.render('enroll_page', { course_info });
    }
});

course_route.get('/:name/:id', [
    authorizeToken,
    enrollStatus
], (req, res) => {
    const enrollStatus = req.enrollStatus;
    const course_info = req.course_info;
    if (enrollStatus) {
        const email = req.email;
        const course_title = req.course_title;
        const course_description = req.course_description;
        const enrollment_data = req.enrollment_data;
        const topic_id = parseInt(req.params.id);

        const range = req.headers.range;
        if (!range) {
            return res.status(400).send("Requires Range header");
        }

        // get video stats (about 61MB)
        try {

            if (!enrollment_data.completed_topics_id.includes(topic_id)) {

                enrollment_data.completed_topics_id.push(topic_id);
                enrollment_data.completed_topics_id.sort();

                const topics_id_string = `[${enrollment_data.completed_topics_id}]`;

                dbConnection.query("UPDATE enrollment_data SET completed_topics_id = ? WHERE email_id = ? AND course_title = ?", [topics_id_string, email, course_title], (error, result) => {
                    if (error) {
                        console.log("/course_route/:name/:id: Cannot insert topic_id into enrollment_data");
                        return res.json([{ "msg": "Something Went Wrong" }]);
                    }
                });
            }

            const videoName = `${course_title} ${topic_id}.mp4`;
            const videoPath = path.join('public/assets', `${course_title}`, videoName);
            const videoSize = fs.statSync(videoPath).size;

            // Parse Range
            // Example: "bytes=32324-"
            const CHUNK_SIZE = 10 ** 6; // 1MB
            const start = Number(range.replace(/\D/g, ""));
            const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

            // Create headers
            const contentLength = end - start + 1;
            const headers = {
                "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                "Accept-Ranges": "bytes",
                "Content-Length": contentLength,
                "Content-Type": "video/mp4",
            };

            // HTTP Status 206 for Partial Content
            res.writeHead(206, headers);

            // create video read stream for this particular chunk
            const videoStream = fs.createReadStream(videoPath, { start, end });

            // Stream the video chunk to the client
            videoStream.pipe(res);

        } catch (error) {
            console.log("Video File Not Found Error:\n", error)
            res.writeHead(500);
            return res.json([{ "msg": "Video File Not Found" }]);
        }

    } else {
        // PLEASE ENROLL TO CONTINUE PAGE
        return res.render('enroll_page', { course_info });
    }
});

course_route.get('/:name', [
    authorizeToken,
    enrollStatus
], (req, res) => {
    const enrollStatus = req.enrollStatus;
    const course_info = req.course_info;
    if (enrollStatus) {
        const email = req.email;
        const course_title = req.course_title;
        const course_description = req.course_description;
        const enrollment_data = req.enrollment_data;

        const course_topics = course_info.course_topics;
        const completed_topics_id = enrollment_data.completed_topics_id;
        return res.render('course_page', { course_title, course_description, enrollment_data, course_topics, completed_topics_id });
    }
    else {
        // PLEASE ENROLL TO CONTINUE PAGE
        return res.render('enroll_page', { course_info });
    }
});

course_route.get('/*', (req, res) => {
    res.render('error_page', { error_code: '404 Page Not Found' });
});
course_route.post('/*', (req, res) => {
    res.render('error_page', { error_code: '404 Page Not Found' });
});
course_route.put('/*', (req, res) => {
    res.render('error_page', { error_code: '404 Page Not Found' });
});
course_route.delete('/*', (req, res) => {
    res.render('error_page', { error_code: '404 Page Not Found' });
});

module.exports = course_route;