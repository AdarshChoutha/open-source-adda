function fetch_video(course_title, topic_id) {
    document.getElementById("course_video").src = `/course/${course_title}/${topic_id}`;
}

document.addEventListener('DOMContentLoaded', (event) => {

    //  Topics Container Max Height To Start Scrolling
    let t_c_h1 = document.getElementById('video_container').offsetHeight;
    let t_c_h2 = document.getElementById('description_container').offsetHeight;
    let t_c_h3 = document.getElementById('rating_container').offsetHeight;
    document.getElementById('topics_container').style.maxHeight = t_c_h1 + t_c_h2 + t_c_h3 + "px";

    document.getElementById("topics_container").onclick = (event) => {
        document.getElementsByClassName("current-topic")[0].classList.remove("current-topic");
        if (!event.target.parentElement.classList.contains("current-topic"))
            event.target.parentElement.classList.add("current-topic")
    }

    document.getElementById("stars").onclick = (event) => {
        const target_id = getTargetId();
        const rating_given = target_id + 1;
        function getTargetId() {
            for (let k = 0; k < 5; k++) if (event.target === document.getElementById("stars").children[k]) return k;
        }
        if (target_id != undefined) {

            for (let k = 0; k <= target_id; k++) document.getElementById("stars").children[k].classList.replace("far", "fas");
            for (let k = 4; k > target_id; k--) document.getElementById("stars").children[k].classList.replace("fas", "far");

            const course_title = document.getElementById("title").innerText.toString();
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    rating_given,
                })
            }
            fetch(`/course/${course_title}/put_rating`, options)
                .catch((error) => { console.error(error); });
        }
    }

});