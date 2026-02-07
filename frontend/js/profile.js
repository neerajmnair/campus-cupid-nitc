document.getElementById("profileForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const profileData = {
        name: document.getElementById("name").value,
        department: document.getElementById("department").value,
        year: document.getElementById("year").value,
        interests: document.getElementById("interests").value,
        bio: document.getElementById("bio").value
    };

    const message = document.getElementById("message");

    try {

        // Later connect to FastAPI endpoint
        console.log(profileData);

        message.style.color = "#9cffc7";
        message.innerText = "Profile saved successfully ❤️";

    } catch {
        message.style.color = "#ff8a80";
        message.innerText = "Error saving profile";
    }

});
